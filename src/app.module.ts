import { Module } from '@nestjs/common';
import { ChatWsModule } from './chat-ws/chat-ws.module';

@Module({
  imports: [ChatWsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
