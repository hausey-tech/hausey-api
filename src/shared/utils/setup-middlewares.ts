import { Express, json } from 'express';

import { cors } from '../middlewares/cors';
import { errorHandler } from '../errors/error-handler';

export const setupMiddlewares = (app: Express): void => {
  app.use(json());
  app.use(cors);
  app.use(errorHandler);
};
