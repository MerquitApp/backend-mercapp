import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsAlpha('es-ES', {
    message: 'El nombre no puede contener caracteres especiales',
  })
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
