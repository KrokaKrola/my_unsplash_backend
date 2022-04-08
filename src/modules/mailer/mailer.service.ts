import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { AsyncResultCallback, retry } from 'async';
import Mail from 'nodemailer/lib/mailer';
import { Logger } from '@nestjs/common';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import { EmailsConfigurationService } from 'src/config/emails/configuration.service';
import { MailStatus as MailStatus } from 'src/common/enums/mail-status';
import { stringifyError } from 'src/common/utils/stringifyError';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private readonly transporter: Mail;

  constructor(
    private readonly emailConfigService: EmailsConfigurationService,
    private prismaService: PrismaService,
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
    const mail = await this.prismaService.mail.findUnique({
      where: {
        id: mailId,
      },
    });

    if (!mail) {
      throw new UnprocessableEntityException(
        'Cant find email with id: ',
        `${mailId}`,
      );
    }

    await this.prismaService.mail.update({
      data: {
        status: MailStatus.PROCESSING,
      },
      where: {
        id: mailId,
      },
    });

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
          await this.prismaService.mail.update({
            data: {
              status: MailStatus.FAILED,
              info: stringifyError(error, null, '\t'),
            },
            where: {
              id: mailId,
            },
          });
        } else {
          await this.prismaService.mail.update({
            data: {
              status: MailStatus.SENT,
              info: JSON.stringify(result),
            },
            where: {
              id: mailId,
            },
          });
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
