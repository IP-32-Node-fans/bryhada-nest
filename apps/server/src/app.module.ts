import { Module } from '@nestjs/common';
import { CurrencyModule } from './domains/currency/currency.module';
import { HealthModule } from './domains/health/health.module';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [CurrencyModule, HealthModule, UsersModule, AuthModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
