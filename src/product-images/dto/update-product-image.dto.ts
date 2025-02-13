import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductImageDto } from './create-product-image.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductImageDto extends PartialType(
  OmitType(CreateProductImageDto, ['productId']),
) {
  @ApiProperty({
    description: 'URL o referencia de la imagen',
    example: 'http://example.com/image.jpg',
  })
  imageUrl: string;
}
