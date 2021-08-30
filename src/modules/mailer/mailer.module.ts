import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { BullModule } from '@nestjs/bull';
import { MailerProcessor } from './mailer.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailer',
    }),
  ],
  providers: [MailerService, MailerProcessor],
  exports: [MailerProcessor],
})
export class MailerModule {}
