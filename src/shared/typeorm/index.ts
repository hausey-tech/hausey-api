import 'dotenv/config';
import { DataSource } from 'typeorm';

export const rootPath = `${__dirname}/../../`;

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [`${rootPath}/modules/**/entities/*.{ts,js}`],
  migrations: [`${rootPath}/shared/typeorm/migrations/*.{ts,js}`],
  ssl: {
    rejectUnauthorized: false,
  },
});
