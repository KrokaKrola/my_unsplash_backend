import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { EmailsConfigurationService } from './configuration.service';
import configuration from './configuration';
import { ConfigModule } from '@nestjs/config';

/**
 * Import and provide email configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        EMAIL_SMTP_ID: Joi.string().required(),
        EMAIL_SMTP_PASSWORD: Joi.string().required(),
        EMAIL_SMTP_HOST: Joi.string().required(),
        EMAIL_SMTP_PORT: Joi.number().default(465),
      }),
    }),
  ],
  providers: [EmailsConfigurationService],
  exports: [EmailsConfigurationService],
})
export class EmailsConfigurationModule {}
