import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/models/users/dtos/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/models/users/entities/users.entity';
import { Repository } from 'typeorm';
import { generateToken } from 'src/common/utils/generateToken';
import { EmailVerificationEntity } from 'src/models/users/entities/email-verifications.entity';
import { EmailsEntity } from 'src/models/emails/entities/emails.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendRegistrationEmailQueue } from '../interfaces/SendRegistrationEmailQueue.interface';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersRegistrationService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(EmailVerificationEntity)
    private emailVerificationRepository: Repository<EmailVerificationEntity>,
    @InjectRepository(EmailsEntity)
    private emailsRepository: Repository<EmailsEntity>,
    @InjectQueue('registrationEmailsQueue') private readonly mailerQueue: Queue,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const existedEmailUser = await this.usersService.findOneByEmail(
      registerUserDto.email,
    );

    if (existedEmailUser) {
      throw new ConflictException('Credentials are incorrect');
    }

    const existedUsernameUser = await this.usersService.findOneByUsername(
      registerUserDto.username,
    );

    if (existedUsernameUser) {
      throw new ConflictException('Credentials are incorrect');
    }

    try {
      const userEntity = new UsersEntity(registerUserDto);

      const emailsEntity = new EmailsEntity();

      const verificationEmailEntity = new EmailVerificationEntity();

      verificationEmailEntity.email = emailsEntity;
      verificationEmailEntity.hash = await generateToken({ byteLength: 32 });
      verificationEmailEntity.user = userEntity;

      const email = await this.emailsRepository.save(emailsEntity);

      const verificationEmail = await this.emailVerificationRepository.save(
        verificationEmailEntity,
      );

      const user = await this.usersRepository.save(userEntity);

      await this.mailerQueue.add('sendRegistrationEmail', {
        id: email.id,
        hash: verificationEmail.hash,
        email: user.email,
      } as SendRegistrationEmailQueue);

      return {
        token: this.authService.signToken(user.id, user.email),
        user,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
