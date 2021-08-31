import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/models/users/entities/users.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from 'src/models/users/dtos/loginUser.dto';
import { ApiTokenEntity } from 'src/models/users/entities/api-tokens.entity';
import { generateToken } from 'src/common/utils/generateToken';

@Injectable()
export class UsersLoginService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(ApiTokenEntity)
    private apiTokensRepository: Repository<ApiTokenEntity>,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      username: loginUserDto.username,
    });

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    const isPasswordCorrect = await user.verifyPassword(loginUserDto.password);

    if (!isPasswordCorrect) {
      throw new ForbiddenException('Given password is not correct');
    }

    const apiTokenEntity = new ApiTokenEntity();
    apiTokenEntity.user = user;
    apiTokenEntity.token = await generateToken();

    const apiToken = await this.apiTokensRepository.save(apiTokenEntity);

    return { token: apiToken.token, user };
  }
}
