import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOauthUserDto {
  @IsAlpha('es-ES', {
    message: 'El nombre no puede contener caracteres especiales',
  })
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  profile_picture: string;
}
