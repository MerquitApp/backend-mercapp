import { Module } from '@nestjs/common';
import { ChatWsModule } from './chat-ws/chat-ws.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ChatWsModule, ChatModule, MessagesModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
