import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/warehouse/auth/auth.module';

@Module({
  providers: [ChatWsGateway, ChatWsService],
  imports: [ConfigModule, AuthModule],
})
export class ChatWsModule {}
