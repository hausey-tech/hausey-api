import 'reflect-metadata';
import 'express-async-errors';
import './container';

import cors from 'cors';
import express from 'express';

import { routes } from './routes';
import { errorHandler } from './errors/error-handler';
import { PostgresDataSource } from './typeorm';

const app = express();
const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
};

const start = async () => {
  try {
    await PostgresDataSource.initialize();

    app.use(cors(corsOptions));
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
