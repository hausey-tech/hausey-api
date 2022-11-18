import { Router } from 'express';

import { usersRouter } from '../../modules/users/routes/users';
import { sessionsRouter } from '../../modules/users/routes/sessions';
import { appointmentsRouter } from '../../modules/appointments/routes/appointments';
import { slotsRouter } from '../../modules/appointments/routes/slots';
import { specialtiesRouter } from '../../modules/professionals/routes/specialties';
import { programsRouter } from '../../modules/programs/routes/programs';

export const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/appointments', appointmentsRouter, slotsRouter);
routes.use('/professionals', specialtiesRouter);
routes.use('/programs', programsRouter);
