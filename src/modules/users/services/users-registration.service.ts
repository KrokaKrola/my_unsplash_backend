import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/models/users/dtos/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/models/users/entities/users.entity';
import { Repository } from 'typeorm';
import { ApiTokenEntity } from 'src/models/users/entities/api-tokens.entity';
import { generateToken } from 'src/common/utils/generateToken';
import { EmailVerificationEntity } from 'src/models/users/entities/email-verifications.entity';
import { EmailsEntity } from 'src/models/emails/entities/emails.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendRegistrationEmailQueue } from '../interfaces/SendRegistrationEmailQueue.interface';

@Injectable()
export class UsersRegistrationService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(ApiTokenEntity)
    private apiTokensRepository: Repository<ApiTokenEntity>,
    @InjectRepository(EmailVerificationEntity)
    private emailVerificationRepository: Repository<EmailVerificationEntity>,
    @InjectRepository(EmailsEntity)
    private emailsRepository: Repository<EmailsEntity>,
    @InjectQueue('registrationEmailsQueue') private readonly mailerQueue: Queue,
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
      const userEntity = new UsersEntity(registerUserDto);

      const emailsEntity = new EmailsEntity();

      const verificationEmailEntity = new EmailVerificationEntity();

      verificationEmailEntity.email = emailsEntity;
      verificationEmailEntity.hash = await generateToken({ byteLength: 32 });
      verificationEmailEntity.user = userEntity;

      const apiTokenEntity = new ApiTokenEntity();

      apiTokenEntity.user = userEntity;
      apiTokenEntity.token = await generateToken();

      const email = await this.emailsRepository.save(emailsEntity);

      const verificationEmail = await this.emailVerificationRepository.save(
        verificationEmailEntity,
      );

      await this.apiTokensRepository.save(apiTokenEntity);

      const user = await this.usersRepository.save(userEntity);

      await this.mailerQueue.add('sendRegistrationEmail', {
        id: email.id,
        hash: verificationEmail.hash,
        email: user.email,
      } as SendRegistrationEmailQueue);

      return {
        token: apiTokenEntity.token,
        user,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
