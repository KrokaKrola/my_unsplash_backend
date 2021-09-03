import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { AsyncResultCallback, retry } from 'async';
import Mail from 'nodemailer/lib/mailer';
import { Logger } from '@nestjs/common';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import { EmailsConfigurationService } from 'src/config/emails/configuration.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailsEntity } from 'src/models/emails/entities/emails.entity';
import { Repository } from 'typeorm';
import { EmailsStatus } from 'src/models/emails/enums/email-status.enum';
import { stringifyError } from 'src/common/utils/stringifyError';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private readonly transporter: Mail;

  constructor(
    private readonly emailConfigService: EmailsConfigurationService,
    @InjectRepository(EmailsEntity)
    private emailsRepository: Repository<EmailsEntity>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: emailConfigService.host,
      port: +emailConfigService.port,
      secure: +emailConfigService.port === 465, // true for 465, false for other ports
      auth: {
        user: emailConfigService.id,
        pass: emailConfigService.password,
      },
    });
    // this.transporter.use('compile', hbs(hbsEmailConfig));
  }

  public async sendEmail(sendOptions: ISendMailOptions, emailId: number) {
    /* 
    TODO:
    
    1. add check if retries amount < 3, than its ok
    2. if retries amount === 3 return and set error
    3. on retry call sendEmail function with error object if it exists

    Нужно сделать чтобы не блокировать поток мейлов для верификации
    */

    const email = await this.emailsRepository.findOne(emailId);

    if (!email) {
      throw new UnprocessableEntityException(
        'Cant find email with id: ',
        `${emailId}`,
      );
    }

    email.status = EmailsStatus.PROCESSING;
    await this.emailsRepository.save(email);

    return new Promise((resolve, reject) => {
      retry(
        {
          times: 2,
          interval: (retryCount) => {
            return 500 * retryCount;
          },
        },
        (callback) => {
          return this.sendWithRetry(callback, sendOptions);
        },
        async (error, result) => {
          if (error) {
            email.status = EmailsStatus.FAILED;
            email.info = stringifyError(error, null, '\t');
            await this.emailsRepository.save(email);
            reject(error);
          } else {
            email.status = EmailsStatus.SENT;
            email.info = JSON.stringify(result);
            await this.emailsRepository.save(email);
            resolve(result);
          }
        },
      );
    });
  }

  private async sendWithRetry(
    callback: AsyncResultCallback<unknown, Error>,
    sendOptions: ISendMailOptions,
  ) {
    return this.transporter
      .sendMail(sendOptions)
      .then((result) => {
        return callback(null, result);
      })
      .catch((error) => {
        this.logger.error(error);
        callback(error);
      });
  }
}
