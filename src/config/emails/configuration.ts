import { registerAs } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default registerAs('emails', () => ({
  id: process.env.EMAIL_SMTP_ID,
  password: process.env.EMAIL_SMTP_PASSWORD,
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
}));
