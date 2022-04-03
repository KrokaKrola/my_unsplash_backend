import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { AsyncResultCallback, retry } from 'async';
import Mail from 'nodemailer/lib/mailer';
import { Logger } from '@nestjs/common';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import { EmailsConfigurationService } from 'src/config/emails/configuration.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MailEntity } from 'src/models/emails/entities/mail.entity';
import { Repository } from 'typeorm';
import { MailStatus as MailStatus } from 'src/models/emails/enums/mail-status';
import { stringifyError } from 'src/common/utils/stringifyError';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private readonly transporter: Mail;

  constructor(
    private readonly emailConfigService: EmailsConfigurationService,
    @InjectRepository(MailEntity)
    private mailRepository: Repository<MailEntity>,
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

  public async sendEmail(
    sendOptions: ISendMailOptions,
    mailId: number,
  ): Promise<void> {
    const mail = await this.mailRepository.findOne(mailId);

    if (!mail) {
      throw new UnprocessableEntityException(
        'Cant find email with id: ',
        `${mailId}`,
      );
    }

    mail.status = MailStatus.PROCESSING;
    await this.mailRepository.save(mail);

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
        console.log('error, result: ', error, result);
        if (error) {
          mail.status = MailStatus.FAILED;
          mail.info = stringifyError(error, null, '\t');
          await this.mailRepository.save(mail);
        } else {
          mail.status = MailStatus.SENT;
          mail.info = JSON.stringify(result);
          await this.mailRepository.save(mail);
        }
      },
    );
  }

  private async sendWithRetry(
    callback: AsyncResultCallback<unknown, Error>,
    sendOptions: ISendMailOptions,
  ) {
    return this.transporter
      .sendMail(sendOptions)
      .then((result) => {
        console.log('result: ', result);
        return callback(null, result);
      })
      .catch((error) => {
        console.log('error: ', error);
        this.logger.error(error);
        callback(error);
      });
  }
}
