import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description:
      'Nombre del usuario. Solo se permiten letras sin caracteres especiales.',
    example: 'Juan',
  })
  @IsAlpha('es-ES', {
    message: 'El nombre no puede contener caracteres especiales',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario.',
    example: 'juan@example.com',
  })
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
