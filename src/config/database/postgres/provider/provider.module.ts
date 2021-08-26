import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresConfigModule } from '../configuration/configuration.module';
import { PostgresConfigService } from '../configuration/configuration.service';
import { ConnectionOptions } from 'typeorm';
import { AppConfigService } from '../../../app/configuration.service';
import { AppConfigModule } from '../../../app/configuration.module';
import { UsersEntity } from '../../../../models/users/entities/users.entity';

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
          entities: [UsersEntity],
          synchronize: false,
          logging: true,
          // logger: 'advanced-console',
          migrations: [`${process.cwd()}/src/database/migrations`],
          migrationsRun: false,

          seeds: [],
          factories: [],
          dropSchema: false,
          cli: {
            migrationsDir: 'src/database/migrations',
          },
        } as ConnectionOptions & { seeds?: string[]; factories?: string[] }),
      inject: [PostgresConfigService, AppConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class ProviderModule {}
