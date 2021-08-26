import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../models/users/dtos/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../../models/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const user = new UsersEntity();

      user.firstName = registerUserDto.firstName;
      user.lastName = registerUserDto.lastName;
      user.email = registerUserDto.email;
      user.username = registerUserDto.username;
      user.password = registerUserDto.password;

      const result = await this.usersRepository.save(user);

      console.log(result);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
