import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ConfigService } from '@nestjs/config';

@UseGuards(JwtAuthGuard)
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Post(':id')
  createPayment(@Param('id') id: string, @Req() req) {
    const user = req.user;

    return this.paymentsService.createPayment(user.user_id, +id);
  }

  @Get('success')
  async successSession(@Query('session_id') sessionId: string, @Res() res) {
    await this.paymentsService.successSession(sessionId);
    res.redirect(this.configService.get('FRONTEND_URL'));
  }

  @Get('cancel')
  async cancelSession(@Query('session_id') sessionId: string, @Res() res) {
    await this.paymentsService.cancelSession(sessionId);
    res.redirect(this.configService.get('FRONTEND_URL'));
  }
}
