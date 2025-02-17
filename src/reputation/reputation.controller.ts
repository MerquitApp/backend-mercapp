import { Controller, Body, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { CreateReputationDto } from './dto/create-reputation.dto';
import { Reputation } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ReputationEntity } from './entities/reputation.entity';

@ApiTags('reputation')
@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  // Endpoint para crear una nueva reputación
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Crear reputación',
    description: 'Crea una nueva reputación en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reputación creada exitosamente.',
    type: ReputationEntity,
  })
  async create(
    @Body() createReputationDto: CreateReputationDto,
    @Req() req,
  ): Promise<Reputation> {
    const user = req.user;

    return this.reputationService.createReputation(createReputationDto, user);
  }

  // Endpoint para obtener todas las reputaciones
  @Get()
  @ApiOperation({
    summary: 'Obtener reputación',
    description:
      'Obtiene la reputación asociada al ID proporcionado en el cuerpo de la solicitud.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reputación encontrada.',
    type: ReputationEntity,
  })
  async findAll(@Body('id') id: number): Promise<Reputation> {
    return this.reputationService.getReputation(id);
  }
} //cierra clase
