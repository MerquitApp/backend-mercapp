import { IsInt, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReputationDto {
  @ApiProperty({
    description: 'Puntuación de la reputación',
    example: '5',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @ApiProperty({
    description: 'Comentario de la reputación',
    example: 'Esto es una reputación',
  })
  @IsString()
  comment: string;

  @IsString()
  toUserId: number;
}
