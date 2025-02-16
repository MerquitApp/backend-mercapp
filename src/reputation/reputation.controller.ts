import { Controller } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { CreateReputationDto } from './dto/create-reputation.dto';
import { Reputation } from '@prisma/client';
import { Body, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

@ApiTags('reputation')
@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  // Endpoint para crear una nueva reputación
  @Post()
  @ApiOperation({
    summary: 'Crear reputación',
    description: 'Crea una nueva reputación en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reputación creada exitosamente.',
    type: CreateCategoryDto,
  })
  async create(
    @Body() createReputationDto: CreateReputationDto,
  ): Promise<Reputation> {
    return this.reputationService.createReputation(createReputationDto);
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
    type: CreateCategoryDto,
  })
  async findAll(@Body('id') id: number): Promise<Reputation> {
    return this.reputationService.getReputation(id);
  }
} //cierra clase
