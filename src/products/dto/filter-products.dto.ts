import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterProductsDto {
  @IsNumber()
  @Transform(({ value }) => +value)
  @IsOptional()
  limit?: number;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  q?: string;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsOptional()
  user_id?: number;
}
