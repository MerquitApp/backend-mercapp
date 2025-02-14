import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

type Chat = Prisma.ChatGetPayload<{
  include: {
    messages: true;
  };
}>;

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const createChat = await this.prisma.chat.create({
      include: {
        messages: true,
      },
    });
    return createChat;
  }
}
