import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from './configuration.service';
import * as Joi from 'joi';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        API_VERSION: Joi.string().default('v1.0'),
        API_BASE_URL: Joi.string().required()
      })
    })
  ],
  providers: [ApiConfigService],
  exports: []
})
export class ApiConfigurationModule {}
