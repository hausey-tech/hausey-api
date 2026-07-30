import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const rootPath = `${__dirname}/../../`;

const databaseUrl = process.env.DATABASE_URL ?? '';
const isLocalDatabase =
  databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
const shouldUseSsl =
  process.env.NODE_ENV === 'production' ||
  process.env.DATABASE_SSL === 'true' ||
  (databaseUrl.length > 0 && !isLocalDatabase);

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [`${rootPath}/modules/**/entities/*.{ts,js}`],
  migrations: [`${rootPath}/shared/typeorm/migrations/*.{ts,js}`],
  namingStrategy: new SnakeNamingStrategy(),
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});
