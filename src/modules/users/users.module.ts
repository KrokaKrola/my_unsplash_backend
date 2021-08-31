import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../models/users/entities/users.entity';
import { ApiTokenEntity } from 'src/models/users/entities/api-tokens.entity';
import { EmailVerificationEntity } from '../../models/users/entities/email-verifications.entity';
import { EmailsEntity } from '../../models/emails/entities/emails.entity';
import { BullModule } from '@nestjs/bull';
import { UsersProcessor } from './users.processor';
import { MailerModule } from '../mailer/mailer.module';
import { UsersRegistrationService } from './services/users-registration.service';
import { UsersLoginService } from './services/users-login.service';

@Module({
  imports: [
    MailerModule,
    TypeOrmModule.forFeature([
      UsersEntity,
      ApiTokenEntity,
      EmailVerificationEntity,
      EmailsEntity,
    ]),
    BullModule.registerQueue({
      name: 'registrationEmailsQueue',
    }),
  ],
  providers: [UsersProcessor, UsersRegistrationService, UsersLoginService],
  controllers: [UsersController],
})
export class UsersModule {}
