import { Express } from 'express';

import { cors } from '../middlewares/cors';

export const setupMiddlewares = (app: Express): void => {
  app.use(cors);
};
