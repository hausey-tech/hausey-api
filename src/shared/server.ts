import 'reflect-metadata';
import 'express-async-errors';
import './container';
import express from 'express';
import routes from './routes';
import errorHandler from './errors/errorHandler';
import { PostgresDataSource } from './database';

const app = express();

const start = async () => {
  try {
    await PostgresDataSource.initialize();

    app.use(express.json());
    app.use('/api', routes);
    app.use(errorHandler);
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server started on port ${process.env.PORT}!`),
    );
  } catch (err) {
    console.error(err);
  }
};

start();
