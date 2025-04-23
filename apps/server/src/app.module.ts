import { Module } from '@nestjs/common';
import { CurrencyModule } from './domains/currency/currency.module';
import { HealthModule } from './domains/health/health.module';
@Module({
  imports: [CurrencyModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
