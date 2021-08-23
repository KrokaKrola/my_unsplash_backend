import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppConfigService } from './config/app/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const appConfig: AppConfigService = app.get(AppConfigService);

  await app.listen(appConfig.port);
}

void bootstrap();
