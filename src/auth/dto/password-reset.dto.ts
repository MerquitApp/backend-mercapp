import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class PasswordResetDto {
  @IsString()
  token: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
