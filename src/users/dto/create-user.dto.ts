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

  @ApiProperty({
    description: 'Contraseña fuerte que cumpla con las políticas de seguridad.',
    example: 'Str0ngP@ssword!',
  })
  @IsStrongPassword()
  password: string;
}
