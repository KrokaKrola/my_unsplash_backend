import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EmailsConfigurationModule } from 'src/config/emails/configuration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailEntity } from 'src/models/emails/entities/mail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailEntity]), EmailsConfigurationModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
