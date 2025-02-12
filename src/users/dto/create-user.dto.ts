import { Transform } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  name: string;

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
