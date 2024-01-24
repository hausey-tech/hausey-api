import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const rootPath = `${__dirname}/../../`;

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [`${rootPath}/modules/**/entities/*.{ts,js}`],
  migrations: [`${rootPath}/shared/typeorm/migrations/*.{ts,js}`],
  namingStrategy: new SnakeNamingStrategy(),
  ssl: {
    rejectUnauthorized: false,
  },
});
