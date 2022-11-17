import 'reflect-metadata';
import 'express-async-errors';
import './container';

import express from 'express';

import { PostgresDataSource } from './typeorm';
import { setupSwagger } from './utils/setup-swagger';
import { setupMiddlewares } from './utils/setup-middlewares';
import { setupRoutes } from './utils/setup-routes';

const app = express();

const start = async () => {
  try {
    await PostgresDataSource.initialize();

    setupSwagger(app);
    setupMiddlewares(app);
    setupRoutes(app);

    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server started on port ${process.env.PORT}!`),
    );
  } catch (err) {
    console.error(err);
  }
};

start();
