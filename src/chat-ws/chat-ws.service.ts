import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatWsService {
  handleMessage(client: any, message: string) {
    return client.broadcast.emit('message', message);
  }
}
