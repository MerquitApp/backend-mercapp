import { Controller } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { CreateReputationDto } from './dto/create-reputation.dto';
import { Reputation } from '@prisma/client';
import { Body, Get, Post } from '@nestjs/common';

@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  // Endpoint para crear una nueva reputación
  @Post()
  async create(
    @Body() createReputationDto: CreateReputationDto,
  ): Promise<Reputation> {
    return this.reputationService.createReputation(createReputationDto);
  }

  // Endpoint para obtener todas las reputaciones
  @Get()
  async findAll(@Body('id') id: number): Promise<Reputation> {
    return this.reputationService.getReputation(id);
  }
} //cierra clase
