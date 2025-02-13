import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Get()
  @ApiOperation({
    summary: 'Obtener pagos',
    description: 'Obtiene una lista de pagos disponibles.',
  })
  @ApiResponse({ status: 200, description: 'Lista de pagos.' })
  getPayments() {
    return this.paymentsService.getPayments();
  }
}
