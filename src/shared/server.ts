import 'reflect-metadata';
import 'express-async-errors';
import './container';

import express from 'express';

import pino from 'pino';
import { pinoHttp } from 'pino-http';
import { PostgresDataSource } from './typeorm';
import {
  setupSwagger,
  setupMiddlewares,
  setupRoutes,
  setupErrorHandler,
} from './utils';

const app = express();

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));

const start = async () => {
  try {
    await PostgresDataSource.initialize();

    setupSwagger(app);
    setupMiddlewares(app);
    setupRoutes(app);
    setupErrorHandler(app);

    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server started on port ${process.env.PORT}!`),
    );
  } catch (err) {
    console.error(err);
  }
};

start();
