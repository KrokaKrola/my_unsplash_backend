import { registerAs } from "@nestjs/config";

export default registerAs('api', () => ({
  version: process.env.API_VERSION,
  baseUrl: process.env.API_BASE_URL,
}));