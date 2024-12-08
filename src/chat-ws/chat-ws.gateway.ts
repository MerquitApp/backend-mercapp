import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatWsGateway {
  constructor(private readonly chatWsService: ChatWsService) {}

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    message: string,
  ) {
    return this.chatWsService.handleMessage(client, message);
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
