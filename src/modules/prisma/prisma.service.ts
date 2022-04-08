import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      const result = await next(params);
      if (
        params.action === 'create' &&
        params.model === 'RegistrationCandidate'
      ) {
        await this.registrationCandidate.update({
          where: {
            id: result.id,
          },
          data: {
            password: crypto
              .pbkdf2Sync(
                result.password,
                process.env.APP_PASSWORD_SALT,
                1000,
                64,
                'sha512',
              )
              .toString('hex'),
          },
        });
      }

      return result;
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
