import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  providers: [ChatWsGateway, ChatWsService],
  imports: [ConfigModule, AuthModule, ChatModule],
})
export class ChatWsModule {}
