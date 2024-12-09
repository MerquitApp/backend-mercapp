import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsImageFile } from '../validations/isImageFile';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsImageFile()
  cover_image: Express.Multer.File;

  @IsOptional()
  tags?: string[];

  @IsOptional()
  categories?: string[];

  @IsOptional()
  images?: Express.Multer.File[];
}
