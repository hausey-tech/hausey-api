import { Express, json } from 'express';

import { cors } from '../middlewares/cors';

export const setupMiddlewares = (app: Express): void => {
  app.use(json());
  app.use(cors);
};
