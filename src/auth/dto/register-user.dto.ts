import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

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
