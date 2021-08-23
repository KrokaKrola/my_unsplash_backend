import { Module } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.json(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
          level: 'debug',
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.printf((info) => {
              return `${JSON.stringify(info)}`;
            }),
          ),
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    }),
  ],
})
export class LoggerModule {}
