import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';

@WebSocketGateway()
export class ChatWsGateway {
  constructor(private readonly chatWsService: ChatWsService) {}

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket()
    client: any,
    @MessageBody()
    message: string,
  ) {
    return this.chatWsService.handleMessage(client, message);
  }
}
