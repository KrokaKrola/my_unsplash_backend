import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EmailsConfigurationModule } from 'src/config/emails/configuration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsEntity } from 'src/models/emails/entities/emails.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailsEntity]),
    EmailsConfigurationModule,
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
