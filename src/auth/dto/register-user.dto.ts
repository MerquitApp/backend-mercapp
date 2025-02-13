import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUsersDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Str0ngP@ssw0rd',
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
