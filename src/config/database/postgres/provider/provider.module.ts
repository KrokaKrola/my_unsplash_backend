import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresConfigModule } from '../configuration/configuration.module';
import { PostgresConfigService } from '../configuration/configuration.service';
import { ConnectionOptions } from 'typeorm';
import { AppConfigModule } from '../../../app/configuration.module';
import { RegistrationCandidateEntity } from '../../../../models/users/entities/registration-candidate.entity';
import { EmailVerificationEntity } from '../../../../models/users/entities/email-verifications.entity';
import { MailEntity } from '../../../../models/emails/entities/mail.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule, AppConfigModule],
      useFactory: (postgresConfigService: PostgresConfigService) =>
        ({
          type: 'postgres',
          host: postgresConfigService.host,
          port: postgresConfigService.port,
          username: postgresConfigService.username,
          password: postgresConfigService.password,
          database: postgresConfigService.name,
          entities: [
            RegistrationCandidateEntity,
            EmailVerificationEntity,
            MailEntity,
            UserEntity,
          ],
          logging: true,
        } as ConnectionOptions & { seeds?: string[]; factories?: string[] }),
      inject: [PostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class ProviderModule {}
