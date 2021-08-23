import { registerAs } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default registerAs('redis', () => ({
  port: process.env.REDIS_PORT,
}));
