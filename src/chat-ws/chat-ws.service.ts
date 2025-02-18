import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { AUTH_COOKIE } from 'src/common/constants';
import { parseCookies } from 'src/common/helpers/parseCookies';
import type { Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';
import { MessageService } from 'src/message/message.service';
import { User } from '@prisma/client';

@Injectable()
export class ChatWsService {
  private calls = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  async handleMessage(client: Socket, messageDto: MessageDto, user: User) {
    try {
      await this.messageService.createMessage({
        ...messageDto,
        user_id: user.user_id,
      });
    } catch (error) {
      console.log(error);
    }

    return client.to(`${messageDto.chat_id}`).emit('message', messageDto);
  }

  handleOffer(callId: string, offer: string) {
    this.calls[callId] = {
      offer,
      answerCandidates: [],
      offerCandidates: [],
    };
  }

  handleAnswer(client: Socket, callId: string, answer: string) {
    this.calls[callId].answer = answer;
    client.broadcast.emit('answer', answer);
    client.emit('offer', this.calls[callId].offer);
    client.emit('ice-offer', this.calls[callId].offerCandidates);
  }

  handleICECandidateOffer(client: Socket, callId: string, ice: string) {
    if (!this.calls[callId].offerCandidates) {
      this.calls[callId].offerCandidates = [ice];
    } else {
      this.calls[callId].offerCandidates.push(ice);
    }
  }

  handleICECandidateAnswer(client: Socket, callId: string, ice: string) {
    if (!this.calls[callId].answerCandidates) {
      this.calls[callId].answerCandidates = [ice];
    } else {
      this.calls[callId].answerCandidates.push(ice);
    }
    client.broadcast.emit('ice-answer', ice);
  }

  handleJoinCall(client: Socket, callId: string) {
    client.emit('join-call', callId, this.calls[callId].offer);
  }

  async getUserIdAuth(client: Socket) {
    const cookies = parseCookies(client.handshake.headers.cookie);
    const authCookie = cookies?.[AUTH_COOKIE];

    if (!authCookie) {
      client.disconnect();
      return;
    }

    const token = cookieParser.signedCookie(
      decodeURIComponent(authCookie),
      this.configService.get('COOKIE_SECRET'),
    );

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      return await this.authService.verify(token);
    } catch (err) {
      client.disconnect();
      console.log(err);
    }
  }

  async connectUser(client: Socket, user: any) {
    const chats = await this.chatService.getChatsByUserId(user.user_id);
    const chatsIds = chats.map((chat) => chat.id);

    client.join([user.user_id, ...chatsIds]);
  }
}
