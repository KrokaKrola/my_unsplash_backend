import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from '../../models/users/dtos/registerUser.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }

  @Post('/login')
  login() {
    return {};
  }

  @Post('/logout')
  logout() {
    return {};
  }

  @Get('/me')
  getUser() {
    return {};
  }

  @Patch('/me')
  updateUser() {
    return {};
  }

  @Delete('/me')
  deleteUser() {
    return {};
  }
}
