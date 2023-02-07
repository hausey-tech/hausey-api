import { Express } from 'express';

import { AppError } from '../errors/app-error';
import { routes } from '../routes';

export const setupRoutes = (app: Express): void => {
  app.use('/v1', routes);
  app.use('/', () => {
    throw new AppError(
      'Rota não encontrada, verifique e tente novamente!',
      404,
    );
  });
};
