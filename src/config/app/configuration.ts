import { registerAs } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
  url: process.env.APP_URL,
}));
