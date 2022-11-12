import { Router } from 'express';

import { usersRouter, sessionsRouter } from '../../modules/users/routes';

export const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
