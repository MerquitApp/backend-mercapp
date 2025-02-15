import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

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
}
