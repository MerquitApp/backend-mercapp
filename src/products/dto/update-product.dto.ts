import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptop de 15 pulgadas',
  })
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1500,
  })
  price: number;

  @ApiProperty({
    description: 'Stock del producto',
    example: 100,
  })
  stock: number;

  @ApiProperty({
    description: 'ID de la categoría a la que pertenece el producto',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'ID de la marca a la que pertenece el producto',
    example: 1,
  })
  brandId: number;

  @ApiProperty({
    description: 'Estado del producto',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Imagen de portada del producto',
    example: 'http://example.com/image.jpg',
  })
  coverImage: string;

  @ApiProperty({
    description: 'Etiquetas del producto',
    example: ['nuevo', 'oferta'],
    required: false,
    isArray: true,
    type: String,
  })
  tags: string[];

  @ApiProperty({
    description: 'Categorías del producto',
    example: ['Electrónica', 'Hogar'],
    required: false,
    isArray: true,
    type: String,
  })
  categories: string[];

  @ApiProperty({
    description: 'Imágenes adicionales del producto',
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    required: false,
    isArray: true,
    type: String,
  })
  brand: string;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Electrónica',
  })
  category: string;

  @ApiProperty({
    description: 'Fecha de creación del producto',
    example: '2021-07-01T00:00:00.000Z',
  })
  createdAt: Date;
}
