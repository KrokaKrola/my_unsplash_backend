import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendRegistrationEmailQueue } from './interfaces/SendRegistrationEmailQueue.interface';
import { MailerService } from 'src/modules/mailer/mailer.service';

@Processor('registrationEmailsQueue')
export class UsersProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('sendVerificationEmail')
  public async handleSend(job: Job<SendRegistrationEmailQueue>) {
    try {
      return await this.mailerService.sendEmail(
        {
          from: 'harlamsan@gmail.com',
          to: job.data.email,
          html: job.data.code,
        },
        job.data.id,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
