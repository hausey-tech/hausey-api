import { Router } from 'express';

import { usersRouter, sessionsRouter } from '../../modules/users/routes';
import { appointmentsRouter } from '../../modules/appointments/routes';

export const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/appointments', appointmentsRouter);
