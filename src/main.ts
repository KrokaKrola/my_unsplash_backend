import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppConfigService } from './config/app/configuration.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiConfigService } from './config/api/configuration.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookieParser());

  const appConfig: AppConfigService = app.get(AppConfigService);
  const apiConfig: ApiConfigService = app.get(ApiConfigService);

  const documentBuilder = new DocumentBuilder()
    .setTitle('My Unsplash API')
    .addCookieAuth('Authentication')
    .addServer(`${apiConfig.baseUrl}/${apiConfig.version}/api`)
    .setVersion(apiConfig.version)
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup(`${apiConfig.version}/docs`, app, document);

  app.setGlobalPrefix(`${apiConfig.version}/api`);

  await app.listen(appConfig.port);
}

void bootstrap();
