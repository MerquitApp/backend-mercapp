import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsImageFile } from '../validations/isImageFile';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Nombre del producto', example: 'Producto 1' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Este es un producto de alta calidad.',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Precio del producto', example: 99.99 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Imagen de portada del producto',
    type: 'string',
    format: 'binary',
  })
  @IsImageFile()
  cover_image: Express.Multer.File;

  @ApiProperty({
    description: 'Etiquetas del producto',
    example: ['nuevo', 'oferta'],
    required: false,
    isArray: true,
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  tags?: string[];

  @ApiProperty({
    description: 'Categorías del producto',
    example: ['Electrónica', 'Hogar'],
    required: false,
    isArray: true,
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  categories?: string[];

  @ApiProperty({
    description: 'Imágenes adicionales del producto',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  @IsOptional()
  images?: Express.Multer.File[];
}
