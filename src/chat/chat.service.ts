import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

type Chat = Prisma.ChatGetPayload<{
  include: {
    messages: true;
    users: true;
  };
}>;

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const createChat = await this.prisma.chat.create({
      data: {
        users: {
          connect: [
            {
              user_id: createChatDto.user_1_id,
            },
            {
              user_id: createChatDto.user_2_id,
            },
          ],
        },
      },
      include: {
        messages: true,
        users: true,
      },
    });
    return createChat;
  }

  async deleteById(chat_id: number): Promise<Chat> {
    const chat = await this.prisma.chat.delete({
      where: {
        id: chat_id,
      },
      include: {
        messages: true,
        users: true,
      },
    });

    return chat;
  }

  async findById(chat_id: number): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chat_id,
      },
      include: {
        messages: true,
        users: true,
      },
    });

    return chat;
  }

  async getChatsByUserId(user_id: number): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            user_id,
          },
        },
      },
      include: {
        messages: true,
        users: true,
      },
    });

    return chats;
  }
}
