import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { SQL } from '../domains/currency/currency.sql';
import { HealthCheckError, HealthIndicatorService } from '@nestjs/terminus';

@Injectable()
export class DatabaseService implements OnModuleDestroy, OnModuleInit {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      user: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
    });
  }

  async onModuleInit() {
    await this.pool.query(SQL.createTables);
    this.logger.log('✅ Migrations successfully created.');
  }

  query = (text: string, params?: any[]) => this.pool.query(text, params);

  async onModuleDestroy() {
    await this.pool.end();
  }
}
