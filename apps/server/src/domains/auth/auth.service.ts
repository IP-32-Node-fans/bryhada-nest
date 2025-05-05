import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

type AuthInput = { email: string; password: string };
type SignInData = { userId: number; email: string; username: string };
type AuthResult = {
  accessToken: string;
  userId: number;
  username: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenciate(input: AuthInput): Promise<AuthResult> {
    const user = this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return await this.signIn(user);
  }

  validateUser(input: AuthInput): SignInData | null {
    const user = this.usersService.findByEmail(input.email);
    if (user && user.password === input.password) {
      return { userId: user.id, email: user.email, username: user.username };
    }
    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const payload = { email: user.email, sub: user.userId };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      userId: user.userId,
      email: user.email,
      username: user.username,
    };
  }
}
