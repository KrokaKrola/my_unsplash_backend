import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresConfigModule } from '../configuration/configuration.module';
import { PostgresConfigService } from '../configuration/configuration.service';
import { ConnectionOptions } from 'typeorm';
import { AppConfigModule } from '../../../app/configuration.module';
import { UsersEntity } from '../../../../models/users/entities/users.entity';
import { ApiTokenEntity } from 'src/models/users/entities/api-tokens.entity';

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
          entities: [UsersEntity, ApiTokenEntity],
          logging: true,
        } as ConnectionOptions & { seeds?: string[]; factories?: string[] }),
      inject: [PostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class ProviderModule {}
