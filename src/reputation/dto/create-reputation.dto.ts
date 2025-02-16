import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReputationDto {
  @ApiProperty({
    description: 'Puntuación de la reputación',
    example: '5',
  })
  @IsInt()
  readonly score: number;

  @ApiProperty({
    description: 'Comentario de la reputación',
    example: 'Esto es una reputación',
  })
  @IsString()
  readonly comment: string;

  @ApiProperty({
    description: 'Usuario que ha creado la reputación',
    example: '1',
  })
  @IsInt()
  readonly userId: number;
}
