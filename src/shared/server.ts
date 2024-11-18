import 'reflect-metadata';
import 'express-async-errors';
import './container';

import express from 'express';

import { PostgresDataSource } from './typeorm';
import {
  setupSwagger,
  setupMiddlewares,
  setupRoutes,
  setupErrorHandler,
} from './utils';

const app = express();

app.use(express.urlencoded({ extended: true }));

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
