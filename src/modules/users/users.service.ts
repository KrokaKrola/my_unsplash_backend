import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from '../../models/users/dtos/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../../models/users/entities/users.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from 'src/models/users/dtos/loginUser.dto';
import { ApiTokenEntity } from 'src/models/users/entities/api-tokens.entity';
import { generateToken } from 'src/common/utils/generateToken';
import { EmailVerificationEntity } from '../../models/users/entities/email-verifications.entity';
import { EmailsEntity } from '../../models/emails/entities/emails.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(ApiTokenEntity)
    private apiTokensRepository: Repository<ApiTokenEntity>,
    @InjectRepository(EmailVerificationEntity)
    private emailVerificationRepository: Repository<EmailVerificationEntity>,
    @InjectRepository(EmailsEntity)
    private emailsRepository: Repository<EmailsEntity>,
    @InjectQueue('mailer') private readonly mailerQueue: Queue,
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
      await this.mailerQueue.add('send', {
        test: 'fsdf',
      });

      const userEntity = new UsersEntity(registerUserDto);

      const emailsEntity = new EmailsEntity();

      const verificationEmailEntity = new EmailVerificationEntity();

      verificationEmailEntity.email = emailsEntity;
      verificationEmailEntity.hash = await generateToken({ byteLength: 32 });
      verificationEmailEntity.user = userEntity;

      const apiTokenEntity = new ApiTokenEntity();

      apiTokenEntity.user = userEntity;
      apiTokenEntity.token = await generateToken();

      await this.emailsRepository.save(emailsEntity);

      await this.emailVerificationRepository.save(verificationEmailEntity);

      await this.apiTokensRepository.save(apiTokenEntity);

      const user = await this.usersRepository.save(userEntity);

      return {
        token: apiTokenEntity.token,
        user,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

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
