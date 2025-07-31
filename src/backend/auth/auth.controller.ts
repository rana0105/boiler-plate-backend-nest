import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { BaseResponse } from '../common/response/base.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    try {
      const result = await this.authService.signup(body.email, body.password, body.name);
      return BaseResponse.success('Signup successful', result);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const result = await this.authService.login(body.email, body.password);
      return BaseResponse.success('Login successful', result);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }
}
