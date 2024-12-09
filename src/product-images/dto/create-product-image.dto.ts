import { IsNotEmpty } from 'class-validator';

export class CreateProductImageDto {
  @IsNotEmpty()
  image: string;
  description?: string;
  @IsNotEmpty()
  productId: number;
}
