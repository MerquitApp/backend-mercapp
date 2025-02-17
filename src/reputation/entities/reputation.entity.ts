import { ApiProperty } from '@nestjs/swagger';

export class ReputationEntity {
  @ApiProperty({ description: 'Identificador único de la reputación' })
  id: number;

  @ApiProperty({ description: 'Puntuación de la reputación' })
  score: number;

  @ApiProperty({ description: 'Comentario de la reputación' })
  comment: string;

  @ApiProperty({
    description: 'Identificador del usuario que creó la reputación',
  })
  userId: number;
}
