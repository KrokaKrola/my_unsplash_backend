import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppConfigService } from './config/app/configuration.service';
import { ApiConfigService } from './config/api/configuration.service';
import * as cookieParser from 'cookie-parser';
import * as swaggerUi from 'swagger-ui-express';
import swaggerDescription from 'src/common/swagger';
import { generateToken } from './common/utils/generateToken';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookieParser());

  const appConfig: AppConfigService = app.get(AppConfigService);
  const apiConfig: ApiConfigService = app.get(ApiConfigService);

  apiConfig.baseUrl;

  app.use(
    '/api-docs',
    (req, res, next) => {
      req.swaggerDoc = Object.assign(swaggerDescription, {
        host: req.get('host'),
      });
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup(),
  );

  app.setGlobalPrefix(`${apiConfig.version}/api`);

  await app.listen(appConfig.port);
}

void bootstrap();
