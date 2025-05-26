import { Module } from '@nestjs/common';

import { CurrencyModule } from './domains/currency/currency.module';
import { HealthModule } from './domains/health/health.module';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    CurrencyModule,
    HealthModule,
    UsersModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
