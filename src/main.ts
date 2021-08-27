import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppConfigService } from './config/app/configuration.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiConfigService } from './config/api/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const appConfig: AppConfigService = app.get(AppConfigService);
  const apiConfig: ApiConfigService = app.get(ApiConfigService);

  const documentBuilder = new DocumentBuilder()
    .setTitle('My Unsplash API')
    .addBearerAuth()
    .addServer(apiConfig.baseUrl)
    .setVersion(apiConfig.version)
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup(`${apiConfig.version}/docs`, app, document);


  app.setGlobalPrefix(`api/${apiConfig.version}`);

  await app.listen(appConfig.port);
}

void bootstrap();
