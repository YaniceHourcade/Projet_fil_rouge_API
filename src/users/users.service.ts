import { Injectable } from '@nestjs/common';
import { User } from '../users/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: 1, username: 'Jane', password: '1234', favoris: [], roles: 'user' },
    { id: 2, username: 'Admin', password: 'admin', favoris: [], roles: 'admin' },
  ];

  findAll(): User[] {
    return this.users;
  }
}
