import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MessageModule } from 'src/message/message.module';
import { PrismaService } from 'src/common/db/prisma.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
  exports: [ChatService],
  imports: [MessageModule],
})
export class ChatModule {}
