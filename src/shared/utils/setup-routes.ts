import { Express } from 'express';

import { routes } from '../routes';

export const setupRoutes = (app: Express): void => {
  app.use('/v1', routes);
};
