import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener categorías',
    description: 'Obtiene la lista de categorías disponibles.',
  })
  @ApiResponse({ status: 200, description: 'Lista de categorías.' })
  getAllCategory() {
    return this.categoriesService.getAllCategory();
  }
}
