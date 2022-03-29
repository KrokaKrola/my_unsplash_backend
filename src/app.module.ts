import { Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/Logger.module';
import { AppConfigModule } from './config/app/configuration.module';
import { PostgresConfigModule } from './config/database/postgres/configuration/configuration.module';
import { RedisConfigModule } from './config/database/redis/configuration.module';
import { ProviderModule as PostgresProvider } from './config/database/postgres/provider/provider.module';
import { UsersModule } from './modules/users/users.module';
import { ApiConfigurationModule } from './config/api/configuration.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { RedisProviderModule } from './config/database/redis/provider/provider.module';
import { EmailsConfigurationModule } from './config/emails/configuration.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtConfigurationModule } from './config/jwt/configuration.module';

@Module({
  imports: [
    LoggerModule,
    AppConfigModule,
    PostgresConfigModule,
    RedisConfigModule,
    ApiConfigurationModule,
    EmailsConfigurationModule,
    JwtConfigurationModule,
    PostgresProvider,
    RedisProviderModule,
    MailerModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
