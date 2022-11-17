import { Express } from 'express';

import { errorHandler } from '../errors/error-handler';

export const setupErrorHandler = (app: Express): void => {
  app.use(errorHandler);
};
