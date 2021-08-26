import { NestFactory } from '@nestjs/core';
import { PostgresConfigModule } from './configuration/configuration.module';
import { PostgresConfigService } from './configuration/configuration.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    PostgresConfigModule,
  );

  try {
    const postgresConfigService = appContext.get(PostgresConfigService);
    return {
      type: 'postgres',
      host: postgresConfigService.host,
      port: postgresConfigService.port,
      username: postgresConfigService.username,
      password: postgresConfigService.password,
      database: postgresConfigService.name,
      entities: [`${process.cwd()}/src/**/*.entity{.ts,.js}`],
      synchronize: true,
      migrationsRun: false,
      logging: true,
      logger: 'file',
      seeds: [`${process.cwd()}/src/database/seeds/**/*{.ts,.js}`],
      factories: [`${process.cwd()}/src/database/factories/**/*{.ts,.js}`],
      migrations: [`${process.cwd()}/src/database/migrations/**/*{.ts,.js}`],
      cli: {
        migrationsDir: `src/database/migrations`,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await appContext.close();
  }
}

export default bootstrap();
