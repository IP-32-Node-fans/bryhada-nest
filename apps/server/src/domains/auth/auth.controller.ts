import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() req: Request) {
    return req['user'] as { userId: string; email: string };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto);

    return await this.authService.authenciate(loginDto);
  }

  @Post('login')
  async register(@Body() registerDto: RegisterDto) {
    console.log(registerDto);

    return await this.authService.authenciate(registerDto);
  }
}
