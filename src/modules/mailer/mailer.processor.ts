import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('mailer')
export class MailerProcessor {
  @Process('send')
  public async handleSend(job: Job) {
    console.log(job.data);
  }
}
