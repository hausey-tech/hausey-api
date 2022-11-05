import 'dotenv/config';
import { DataSource } from 'typeorm';

export const rootPath = `${__dirname.slice(0, -16)}`;

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${rootPath}/modules/**/models/*.{ts, js}`],
  migrations: [`${rootPath}/shared/database/migrations/*.{ts, js}`],
});
