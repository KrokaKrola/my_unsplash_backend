import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { RedisConfigService } from './configuration.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

/**
 * Import and provide redis configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), `.env.${process.env.APP_ENV}`),
      load: [configuration],
      validationSchema: Joi.object({
        REDIS_PORT: Joi.number().default(6379),
      }),
    }),
  ],
  providers: [ConfigService, RedisConfigService],
  exports: [ConfigService, RedisConfigService],
})
export class RedisConfigModule {}
