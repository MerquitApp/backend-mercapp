import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateChatDto } from './dto/create-chat.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    const chat = await this.chatService.findById(+id);

    if (chat.users.some((u) => u.user_id === user.user_id)) {
      return chat;
    }

    throw new NotFoundException("Chat doesn't exist");
  }

  @Post('')
  async createChat(@Body() createChatDto: CreateChatDto, @Req() req) {
    const user = req.user;
    return this.chatService.findOrCreateUsersChat(createChatDto, user);
  }
}
