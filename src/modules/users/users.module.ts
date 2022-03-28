import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationCandidateEntity } from '../../models/users/entities/registration-candidate.entity';
import { EmailVerificationEntity } from '../../models/users/entities/email-verifications.entity';
import { MailEntity } from '../../models/emails/entities/mail.entity';
import { BullModule } from '@nestjs/bull';
import { UsersProcessor } from './users.processor';
import { MailerModule } from '../mailer/mailer.module';
import { UsersRegistrationService } from './services/users-registration.service';
import { UsersLoginService } from './services/users-login.service';
import { UsersService } from './services/users.service';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from 'src/models/users/entities/user.entity';

@Module({
  imports: [
    MailerModule,
    AuthModule,
    TypeOrmModule.forFeature([
      RegistrationCandidateEntity,
      EmailVerificationEntity,
      MailEntity,
      UserEntity,
    ]),
    BullModule.registerQueue({
      name: 'registrationEmailsQueue',
    }),
  ],
  providers: [
    UsersProcessor,
    UsersRegistrationService,
    UsersLoginService,
    UsersService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
