import { Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/Logger.module';
import { AppConfigModule } from './config/app/configuration.module';
import { RedisConfigModule } from './config/database/redis/configuration.module';
import { UsersModule } from './modules/users/users.module';
import { ApiConfigurationModule } from './config/api/configuration.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { RedisProviderModule } from './config/database/redis/provider/provider.module';
import { EmailsConfigurationModule } from './config/emails/configuration.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtConfigurationModule } from './config/jwt/configuration.module';
import { PetsModule } from './modules/pets/pets.module';
import { ImagesModule } from './modules/images/images.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    LoggerModule,
    AppConfigModule,
    RedisConfigModule,
    ApiConfigurationModule,
    EmailsConfigurationModule,
    JwtConfigurationModule,
    RedisProviderModule,
    MailerModule,
    UsersModule,
    AuthModule,
    PetsModule,
    ImagesModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
