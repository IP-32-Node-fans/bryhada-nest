import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(
    email: string,
    username: string,
    password: string,
    isAdmin: boolean,
  ): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email,
        username,
        password,
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      },
    });
  }
}
