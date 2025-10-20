import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../users/user.interface';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers(): User[] {
    return this.userService.findAll();
  }
}
