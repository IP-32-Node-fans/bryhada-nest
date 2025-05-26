import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<any>();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Malformed token');
    }

    let payload: { sub: string; email: string; role: UserRole };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    req.user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return true;
  }
}
