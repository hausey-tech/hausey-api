import 'dotenv/config';
import { DataSource } from 'typeorm';

export const rootPath = `${__dirname}/../../../`;

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${rootPath}/modules/**/infra/typeorm/entities/*.{ts,js}`],
  migrations: [`${rootPath}/shared/infra/typeorm/migrations/*.{ts,js}`],
});
