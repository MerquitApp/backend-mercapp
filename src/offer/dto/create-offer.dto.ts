import { IsNumber, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  price: number;
}
