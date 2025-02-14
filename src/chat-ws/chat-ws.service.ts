import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { AUTH_COOKIE } from 'src/common/constants';
import { parseCookies } from 'src/common/helpers/parseCookies';

@Injectable()
export class ChatWsService {
  private calls = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  handleMessage(client: any, message: string) {
    return client.broadcast.emit('message', message);
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

    const token = decodeURIComponent(authCookie).split('s:')[1];

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
}
