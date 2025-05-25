import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query<User>(
      'SELECT * FROM "User" WHERE email = $1 LIMIT 1',
      [email],
    );
    return result.rows[0] ?? null;
  }

  async create(
    email: string,
    username: string,
    password: string,
    isAdmin: boolean,
  ): Promise<User> {
    const role = isAdmin ? 'admin' : 'user';

    const result = await this.db.query<User>(
      `INSERT INTO "User" (email, username, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, now(), now())
       RETURNING *`,
      [email, username, password, role],
    );

    return result.rows[0];
  }
}
