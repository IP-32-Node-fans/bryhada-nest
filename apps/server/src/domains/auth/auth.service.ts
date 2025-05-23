import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto';

type AuthInput = { email: string; password: string };

type Role = 'user' | 'admin';

type SignInData = {
  userId: number;
  email: string;
  username: string;
  role: Role;
};

type AuthResult = {
  accessToken: string;
  userId: number;
  username: string;
  email: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const data = await this.validateUser(input);
    if (!data) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signIn(data);
  }

  async register(input: RegisterDto): Promise<User> {
    const existing = await this.usersService.findByEmail(input.email);

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return this.usersService.create(
      input.email,
      input.username,
      hashedPassword,
      input.isAdmin,
    );
  }

  private async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) return null;

    const isMatches = await bcrypt.compare(input.password, user.password);

    if (!isMatches) return null;

    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role as Role,
    };
  }

  private async signIn(user: SignInData): Promise<AuthResult> {
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      userId: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
