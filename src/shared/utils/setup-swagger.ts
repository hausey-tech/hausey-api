import { Express } from 'express';
import { serve, setup } from 'swagger-ui-express';

import { noCache } from '../middlewares/no-cache';
import swaggerConfig from '../docs';

export const setupSwagger = (app: Express): void => {
  app.use('/docs', noCache, serve, setup(swaggerConfig));
};
