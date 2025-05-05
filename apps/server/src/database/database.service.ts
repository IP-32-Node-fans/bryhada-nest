import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'nestdb',
  });

  query = (text: string, params?: any[]) => this.pool.query(text, params);
  async onModuleDestroy() {
    await this.pool.end();
  }
}
