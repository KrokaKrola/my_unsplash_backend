import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/models/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({ email });
  }

  async findOneByUsername(username: string) {
    return await this.usersRepository.findOne({ username });
  }
}
