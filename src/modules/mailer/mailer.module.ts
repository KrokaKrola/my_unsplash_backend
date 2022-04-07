import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EmailsConfigurationModule } from 'src/config/emails/configuration.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [EmailsConfigurationModule],
  providers: [MailerService, PrismaService],
  exports: [MailerService],
})
export class MailerModule {}
