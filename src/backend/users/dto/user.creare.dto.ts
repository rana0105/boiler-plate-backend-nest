import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsArray,
  IsString,
  IsOptional,
} from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class UserCreateDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Match('password', { message: 'Password confirmation does not match' })
  passwordConfirmation: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsOptional()
  @IsArray({ message: 'Role Names must be an array' })
  @IsString({ each: true, message: 'Each role must be a string' })
  roleNames?: string[];

  @IsOptional()
  @IsArray({ message: 'Permission Names must be an array' })
  @IsString({ each: true, message: 'Each permission must be a string' })
  permissionNames?: string[];
}
