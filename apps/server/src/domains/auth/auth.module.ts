import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { DatabaseModule } from '../../../database/database.module';
config();

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
