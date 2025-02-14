import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

type Message = Prisma.MessageGetPayload<{
  include: {
    chat: true;
  };
}> & {
  chat: {
    id: number;
    createdAt: Date;
  };
};

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const createMessage = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        chat: {
          connect: { id: createMessageDto.chat_id },
        },
      },
      include: {
        chat: true,
      },
    });

    return createMessage;
  }

  async getMessageByChatId(chat_id: number): Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: {
        chatId: chat_id,
      },
      include: {
        chat: true,
      },
    });
  }

  async deleteMessage(id: number): Promise<Message> {
    return await this.prisma.message.delete({
      where: {
        id,
      },
      include: {
        chat: true,
      },
    });
  }

  async updateMessage(
    id: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    return await this.prisma.message.update({
      where: {
        id,
      },
      data: {
        content: updateMessageDto.content,
      },
      include: {
        chat: true,
      },
    });
  }
}
