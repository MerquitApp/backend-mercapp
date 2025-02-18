import { IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  user_id: number;
}
