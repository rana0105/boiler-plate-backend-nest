import {
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Match } from '../.././common/decorators/match.decorator';

export class SignupDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Match('password', { message: 'Password confirmation does not match' })
  passwordConfirmation: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
