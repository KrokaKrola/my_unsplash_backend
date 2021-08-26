import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppConfigService } from './config/app/configuration.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const documentBuilder = new DocumentBuilder()
    .setTitle('My Unsplash API')
    .addBearerAuth()
    .addServer('http://localhost:3000')
    .setVersion('v1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('v1.0/api', app, document);

  const appConfig: AppConfigService = app.get(AppConfigService);

  app.setGlobalPrefix('v1.0');

  await app.listen(appConfig.port);
}

void bootstrap();
