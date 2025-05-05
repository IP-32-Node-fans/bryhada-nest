import { Injectable } from '@nestjs/common';

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
}

// not implemented
const users: User[] = [
  { id: 1, username: 'john', email: 'bak@test.com', password: 'password123' },
  { id: 2, username: 'jane', email: 'bak2@test.com', password: 'password456' },
];

@Injectable()
export class UsersService {
  findByEmail(email: string): User | undefined {
    return users.find((user) => user.email === email);
  }
}
