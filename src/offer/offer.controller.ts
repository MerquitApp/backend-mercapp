import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('offer')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post(':product_id')
  create(
    @Param('product_id') product_id: string,
    @Body() createOfferDto: CreateOfferDto,
    @Req() req,
  ) {
    const userId = req.user.user_id;
    return this.offerService.createOrUpdate(
      +product_id,
      createOfferDto,
      userId,
    );
  }

  @Patch('/accept/:id')
  accept(@Param('id') id: string, @Req() req) {
    const userId = req.user.user_id;
    return this.offerService.accept(+id, userId);
  }

  @Patch('/reject/:id')
  reject(@Param('id') id: string, @Req() req) {
    const userId = req.user.user_id;
    return this.offerService.reject(+id, userId);
  }

  @Get('seller')
  getOffersBySeller(@Req() req) {
    const userId = req.user.user_id;
    return this.offerService.getSellerOffers(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offerService.update(+id, updateOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offerService.remove(+id);
  }
}
