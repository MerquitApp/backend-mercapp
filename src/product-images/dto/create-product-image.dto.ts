import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductImageDto {
  @ApiProperty({
    description: 'URL o referencia de la imagen',
    example: 'http://example.com/image.jpg',
  })
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Descripción de la imagen',
    example: 'Imagen del producto',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'ID del producto al que pertenece la imagen',
    example: 1,
  })
  @IsNotEmpty()
  productId: number;
}
