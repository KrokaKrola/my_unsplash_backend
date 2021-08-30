import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RedisConfigModule } from '../configuration.module';
import { RedisConfigService } from '../configuration.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisConfigModule],
      inject: [RedisConfigService],
      useFactory: (redisConfigService: RedisConfigService) => {
        return {
          redis: {
            host: redisConfigService.host,
            port: redisConfigService.port,
          },
        };
      },
    }),
  ],
})
export class RedisProviderModule {}
