import { Router } from 'express';

import { usersRouter, sessionsRouter } from '../../modules/users/routes';
import {
  appointmentsRouter,
  slotsRouter,
} from '../../modules/appointments/routes';
import { specialtiesRouter } from '../../modules/professionals/routes';

export const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/appointments', appointmentsRouter, slotsRouter);
routes.use('/professionals', specialtiesRouter);
