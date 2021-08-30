import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../models/users/entities/users.entity';
import { ApiTokenEntity } from 'src/models/users/entities/api-tokens.entity';
import { EmailVerificationEntity } from '../../models/users/entities/email-verifications.entity';
import { EmailsEntity } from '../../models/emails/entities/emails.entity';
import { BullModule } from '@nestjs/bull';
import { MailerProcessor } from '../mailer/mailer.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      ApiTokenEntity,
      EmailVerificationEntity,
      EmailsEntity,
    ]),
    BullModule.registerQueue({
      name: 'mailer',
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
