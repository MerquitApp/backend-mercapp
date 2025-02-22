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

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    const user = req.user.user_id;
    return this.offerService.create(createOfferDto, user.user_id);
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
