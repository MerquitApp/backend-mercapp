import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import type { Socket, Server } from 'socket.io';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway()
export class ChatWsGateway implements OnGatewayConnection {
  constructor(private readonly chatWsService: ChatWsService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const user = await this.chatWsService.getUserIdAuth(client);
    await this.chatWsService.connectUser(client, user);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    messageDto: MessageDto,
  ) {
    const user = await this.chatWsService.getUserIdAuth(client);
    return this.chatWsService.handleMessage(client, messageDto, user);
  }

  @SubscribeMessage('join-call')
  handleJoinCall(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    message: string,
  ) {
    const data = JSON.parse(message);
    return this.chatWsService.handleJoinCall(client, data.callId);
  }

  @SubscribeMessage('ice-offer')
  handleWebrtcICECandidateOffer(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    message: string,
  ) {
    const data = JSON.parse(message);
    this.chatWsService.handleICECandidateOffer(
      client,
      data.callId,
      data.candidate,
    );
  }

  @SubscribeMessage('ice-answer')
  handleWebrtcICECandidate(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    message: string,
  ) {
    const data = JSON.parse(message);
    this.chatWsService.handleICECandidateAnswer(
      client,
      data.callId,
      data.candidate,
    );
  }

  @SubscribeMessage('offer')
  handleWebrtcOffer(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    message: string,
  ) {
    const data = JSON.parse(message);
    return this.chatWsService.handleOffer(data.callId, data.offer);
  }

  @SubscribeMessage('answer')
  handleWebrtcAnswer(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    message: string,
  ) {
    const data = JSON.parse(message);
    return this.chatWsService.handleAnswer(client, data.callId, data.answer);
  }
}
