import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/Logger.module';
import { AppConfigModule } from './config/app/configuration.module';
import { PostgresConfigModule } from './config/database/postgres/configuration.module';
import { RedisConfigModule } from './config/database/redis/configuration.module';

@Module({
  imports: [
    LoggerModule,
    AppConfigModule,
    PostgresConfigModule,
    RedisConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
