import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';

const include = {
  messages: true,
  users: true,
};

type Chat = Prisma.ChatGetPayload<{
  include: {
    messages: true;
    users: true;
  };
}>;

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(createChatDto: CreateChatDto, user: User): Promise<Chat> {
    if (user.user_id === createChatDto.user_id) {
      throw new BadRequestException('User ids must be different');
    }

    const createChat = await this.prisma.chat.create({
      data: {
        users: {
          connect: [
            {
              user_id: user.user_id,
            },
            {
              user_id: createChatDto.user_id,
            },
          ],
        },
      },
      include,
    });
    return createChat;
  }

  async deleteById(chat_id: number): Promise<Chat> {
    const chat = await this.prisma.chat.delete({
      where: {
        id: chat_id,
      },
      include,
    });

    return chat;
  }

  async findByUsers(users_id: number[]): Promise<Chat> {
    const chats = await this.prisma.chat.findFirst({
      where: {
        users: {
          some: {
            user_id: {
              in: users_id,
            },
          },
        },
      },
      include,
    });

    return chats;
  }

  async findOrCreateUsersChat(
    createChatDto: CreateChatDto,
    user: User,
  ): Promise<Chat> {
    const chat = await this.findByUsers([user.user_id, createChatDto.user_id]);

    if (chat) {
      return chat;
    }

    const newChat = await this.createChat(createChatDto, user);

    return newChat;
  }

  async findById(chat_id: number): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chat_id,
      },
      include,
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
      include,
    });

    return chats;
  }
}
