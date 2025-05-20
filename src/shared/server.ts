import express from 'express';
import 'reflect-metadata';
import { whatsappRouter } from '../modules/whatsapp/routes-whatsapp';
import 'express-async-errors';
import './container';
import { ensureAuthentication } from './middlewares/ensure-authentication';
import { routes } from './routes';

import { PostgresDataSource } from './typeorm';
import {
  setupSwagger,
  setupMiddlewares,
  setupRoutes,
  setupErrorHandler,
} from './utils';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const start = async () => {
  try {
    await PostgresDataSource.initialize();

    app.use('/v1/whatsapp', whatsappRouter);

    setupSwagger(app);
    setupMiddlewares(app);
    setupRoutes(app);
    setupErrorHandler(app);

    app.use('/v1', ensureAuthentication, routes);

    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server started on port ${process.env.PORT}!`),
    );
  } catch (err) {
    console.error(err);
  }
};

start();
