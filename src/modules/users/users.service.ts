import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
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
    const existedEmailUser = await this.usersRepository.findOne({
      email: registerUserDto.email,
    });

    if (existedEmailUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existedUsernameUser = await this.usersRepository.findOne({
      username: registerUserDto.username,
    });

    if (existedUsernameUser) {
      throw new ConflictException('User with this username already exists');
    }

    try {
      const user = new UsersEntity(registerUserDto);

      return await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
