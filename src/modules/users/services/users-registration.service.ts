import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/modules/users/dtos/registerUser.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendRegistrationEmailQueue } from '../interfaces/SendRegistrationEmailQueue.interface';
import { UsersService } from './users.service';
import { generateFixedLengthInteger } from 'src/common/utils/generateFixedLengthInteger';
import { RegisterEmailVerifyDto } from 'src/modules/users/dtos/registerEmailVerify.dto';
import { MailStatus } from 'src/common/enums/mail-status';
import { differenceInSeconds } from 'date-fns';
import { AuthService } from 'src/modules/auth/auth.service';
import { Response } from 'express';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { generateToken } from 'src/common/utils/generateToken';

@Injectable()
export class UsersRegistrationService {
  constructor(
    @InjectQueue('registrationEmailsQueue') private readonly mailerQueue: Queue,
    private usersService: UsersService,
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const existedEmailUser = await this.prismaService.user.findUnique({
      where: {
        email: registerUserDto.email,
      },
    });

    // check if user with passed email already registered
    if (existedEmailUser) {
      throw new ConflictException('Credentials are incorrect');
    }

    const existedUsernameUser = await this.prismaService.user.findUnique({
      where: {
        username: registerUserDto.username,
      },
    });

    // check if user with passed username already registered
    if (existedUsernameUser) {
      throw new ConflictException('Credentials are incorrect');
    }

    try {
      const emailVerificationHash = await generateToken({ byteLength: 32 });
      const registrationCandidate =
        await this.prismaService.registrationCandidate.create({
          data: {
            email: registerUserDto.email,
            firstName: registerUserDto.firstName,
            hash: emailVerificationHash,
            lastName: registerUserDto.lastName,
            password: registerUserDto.password,
            username: registerUserDto.username,
          },
        });

      const mail = await this.prismaService.mail.create({ data: {} });

      const emailVerification =
        await this.prismaService.emailVerification.create({
          data: {
            code: generateFixedLengthInteger(6).toString(),
            hash: emailVerificationHash,
            maildId: mail.id,
          },
        });

      // add sendEmail task to queue in mailer.service.ts
      await this.mailerQueue.add('sendVerificationEmail', {
        id: mail.id,
        hash: emailVerification.hash,
        email: registrationCandidate.email,
        code: emailVerification.code,
      } as SendRegistrationEmailQueue);

      return {
        hash: emailVerification.hash,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async registerEmailVerify(
    response: Response,
    registerEmailVerify: RegisterEmailVerifyDto,
  ): Promise<{
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    id: number;
  }> {
    const verificationEmail =
      await this.prismaService.emailVerification.findFirst({
        where: {
          hash: registerEmailVerify.hash,
        },
        select: {
          id: true,
          mail: true,
          code: true,
          createdAt: true,
        },
      });

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
      throw new UnprocessableEntityException([
        {
          property: 'code',
          constraints: { notValid: 'Verification code is not correct' },
        },
      ]);
    }

    const registrationCandidate =
      await this.prismaService.registrationCandidate.findFirst({
        where: {
          hash: registerEmailVerify.hash,
        },
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
      await this.prismaService.emailVerification.delete({
        where: {
          id: verificationEmail.id,
        },
      });
      throw new UnprocessableEntityException([
        {
          property: 'code',
          constraints: { notValid: 'Verification code is no longer valid' },
        },
      ]);
    }

    const user = await this.prismaService.user.create({
      data: {
        email: registrationCandidate.email,
        firstName: registrationCandidate.firstName,
        lastName: registrationCandidate.lastName,
        username: registrationCandidate.username,
        password: registrationCandidate.password,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        createdAt: false,
        deletedAt: false,
        currentHashedRefreshToken: false,
        password: false,
        updatedAt: false,
      },
    });

    await this.prismaService.emailVerification.delete({
      where: {
        id: verificationEmail.id,
      },
    });

    await this.prismaService.registrationCandidate.delete({
      where: {
        id: registrationCandidate.id,
      },
    });

    const refreshToken = this.authService.getCookieWithJwtRefreshToken({
      id: user.id,
    });
    const accessToken = this.authService.getCookieWithJwtToken({ id: user.id });

    await this.usersService.setCurrentRefreshToken(refreshToken.token, user.id);

    response.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);

    return user;
  }
}
