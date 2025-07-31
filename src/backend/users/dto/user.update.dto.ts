import { IsEmail, IsOptional, IsString, MinLength, IsArray } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  roleNames?: string[];
}
