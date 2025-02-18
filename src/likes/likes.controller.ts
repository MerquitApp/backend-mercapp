import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get('')
  getLikes(@Req() req) {
    const user = req.user;
    return this.likesService.getUserLikes(user.user_id);
  }

  @Post(':product_id')
  createLike(@Req() req, @Param('product_id') product_id: string) {
    const user = req.user;
    return this.likesService.createLike(user.user_id, +product_id);
  }

  @Delete(':product_id')
  deleteLike(@Req() req, @Param('product_id') product_id: string) {
    const user = req.user;
    return this.likesService.deleteUserLike(user.user_id, +product_id);
  }
}
