import { ConnectionOptions } from 'typeorm';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { UsersEntity } from '../../../models/users/entities/users.entity';

const environment = process.env.NODE_ENV || 'development';
const data: any = dotenv.parse(fs.readFileSync(`.env.${environment}`));

console.log(data);

// Check typeORM documentation for more information.
const config: ConnectionOptions & { seeds: any; factories: any } = {
  type: 'postgres',
  host: data.DATABASE_HOST,
  port: data.DATABASE_PORT,
  username: data.DATABASE_USERNAME,
  password: data.DATABASE_PASSWORD,
  database: data.DATABASE_NAME,
  entities: [UsersEntity],

  synchronize: true,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: true,
  logger: 'file',

  seeds: [`${process.cwd()}/src/database/seeds/**/*{.ts,.js}`],
  factories: [`${process.cwd()}/src/database/factories/**/*{.ts,.js}`],

  migrations: [`${process.cwd()}/src/database/migrations/**/*{.ts,.js}`],
  cli: {
    migrationsDir: `src/database/migrations`,
  },
};

export default config;
