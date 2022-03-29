import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/models/users/dtos/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationCandidateEntity } from 'src/models/users/entities/registration-candidate.entity';
import { Repository } from 'typeorm';
import { generateToken } from 'src/common/utils/generateToken';
import { EmailVerificationEntity } from 'src/models/users/entities/email-verifications.entity';
import { MailEntity } from 'src/models/emails/entities/mail.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendRegistrationEmailQueue } from '../interfaces/SendRegistrationEmailQueue.interface';
import { UsersService } from './users.service';
import { generateFixedLengthInteger } from 'src/common/utils/generateFixedLengthInteger';
import { RegisterEmailVerifyDto } from 'src/models/users/dtos/registerEmailVerify.dto';
import { MailStatus } from 'src/models/emails/enums/mail-status';
import { differenceInSeconds } from 'date-fns';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { Response } from 'express';

@Injectable()
export class UsersRegistrationService {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private emailVerificationRepository: Repository<EmailVerificationEntity>,
    @InjectRepository(MailEntity)
    private mailRepository: Repository<MailEntity>,
    @InjectRepository(RegistrationCandidateEntity)
    private registrationCandidateRepository: Repository<RegistrationCandidateEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectQueue('registrationEmailsQueue') private readonly mailerQueue: Queue,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const existedEmailUser = await this.usersService.findOneByEmail(
      registerUserDto.email,
    );

    // check if user with passed email already registered
    if (existedEmailUser) {
      throw new ConflictException('Credentials are incorrect');
    }

    const existedUsernameUser = await this.usersService.findOneByUsername(
      registerUserDto.username,
    );

    // check if user with passed username already registered
    if (existedUsernameUser) {
      throw new ConflictException('Credentials are incorrect');
    }

    try {
      const mailEntity = new MailEntity();

      const emailVerification = new EmailVerificationEntity();

      emailVerification.mail = mailEntity;
      emailVerification.hash = await generateToken({ byteLength: 32 });
      emailVerification.code = generateFixedLengthInteger(6).toString();

      const registrationCandidate = new RegistrationCandidateEntity(
        registerUserDto,
      );
      registrationCandidate.hash = emailVerification.hash;

      const [mail] = await Promise.all([
        this.mailRepository.save(mailEntity),
        this.emailVerificationRepository.save(emailVerification),
        this.registrationCandidateRepository.save(registrationCandidate),
      ]);

      // add sendEmail task to queue in mailer.service.ts
      await this.mailerQueue.add('sendVerificationEmail', {
        id: mail.id,
        hash: emailVerification.hash,
        email: registerUserDto.email,
        code: emailVerification.code,
      } as SendRegistrationEmailQueue);

      return {
        hash: emailVerification.hash,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async registerEmailVerify(
    response: Response,
    registerEmailVerify: RegisterEmailVerifyDto,
  ): Promise<UserEntity> {
    console.log(registerEmailVerify);
    const verificationEmail = await this.emailVerificationRepository.findOne(
      {
        hash: registerEmailVerify.hash,
      },
      {
        relations: ['mail'],
      },
    );

    // check if there is a verification email for given hash
    // hash is given on register attempt
    if (!verificationEmail) {
      throw new NotFoundException('Verification code not found');
    }

    // check if email successfuly sent to user email
    if (verificationEmail.mail.status !== MailStatus.SENT) {
      throw new BadRequestException('Email not sent, please try again');
    }

    // check if code is correct
    if (verificationEmail.code !== registerEmailVerify.code) {
      throw new UnprocessableEntityException(
        'Verification code is not correct',
      );
    }

    const registrationCandidate =
      await this.registrationCandidateRepository.findOne({
        hash: registerEmailVerify.hash,
      });

    // check if theres an registration candidate in DB
    if (!registrationCandidate) {
      throw new NotFoundException('User for registration is not not found');
    }

    // check that lifetime is less then 60 seconds
    if (
      differenceInSeconds(new Date(), new Date(verificationEmail.createdAt)) >
      60
    ) {
      await verificationEmail.remove();
      throw new UnprocessableEntityException(
        'Verification code is no longer valid',
      );
    }

    const user = new UserEntity({
      email: registrationCandidate.email,
      firstName: registrationCandidate.firstName,
      lastName: registrationCandidate.lastName,
      username: registrationCandidate.username,
      password: registrationCandidate.password,
    });

    await this.userRepository.save(user);
    await registrationCandidate.remove();
    await verificationEmail.remove();

    const refreshToken = this.authService.getCookieWithJwtRefreshToken({
      id: user.id,
    });
    const accessToken = this.authService.getCookieWithJwtToken({ id: user.id });

    await this.usersService.setCurrentRefreshToken(refreshToken.token, user.id);

    response.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);

    return user;
  }
}
