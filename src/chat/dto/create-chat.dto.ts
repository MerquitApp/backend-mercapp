import { IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  user_1_id: number;

  @IsNumber()
  user_2_id: number;
}
