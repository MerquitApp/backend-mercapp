import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónica',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Categoría de productos electrónicos',
    required: false,
  })
  description: string;
}
