import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
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

  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  role: string;

  @IsBoolean()
  verification_state: boolean;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  profile_picture: string;
}
