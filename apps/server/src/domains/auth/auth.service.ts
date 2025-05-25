import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto';
import { DatabaseService } from '../../../database/database.service';

type AuthInput = { email: string; password: string };

type Role = 'USER' | 'ADMIN';

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
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const data = await this.validateUser(input);
    if (!data) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signIn(data);
  }

  async register(input: RegisterDto) {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const role = input.isAdmin ? 'admin' : 'user';

    const insertQuery = `
      INSERT INTO users (email, username, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, username, role;
    `;

    const result = await this.db.query(insertQuery, [
      input.email,
      input.username,
      hashedPassword,
      role,
    ]);

    return result.rows[0];
  }

  private async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.findByEmail(input.email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) return null;

    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  private async findByEmail(email: string) {
    const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
    const result = await this.db.query(query, [email]);
    return result.rows[0];
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