import { Router } from 'express';

import { usersRouter } from '../../modules/users/routes/users';
import { sessionsRouter } from '../../modules/users/routes/sessions';
import { appointmentsRouter } from '../../modules/appointments/routes/appointments';
import { slotsRouter } from '../../modules/appointments/routes/slots';
import { professionalsRouter as appointmentsProfessionalsRouter } from '../../modules/appointments/routes/professionals';
import { professionalSpecialtiesRouter } from '../../modules/professionals/routes/professional-specialties';
import { professionalTypesRouter } from '../../modules/professionals/routes/professional-types';
import { professionalsRouter } from '../../modules/professionals/routes/professionals';
import { programsRouter } from '../../modules/programs/routes/programs';
import { plansRouter } from '../../modules/plans/routes/plans';
import { patientAnamnesesRouter } from '../../modules/patients/routes/patient-anamneses';

export const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use(
  '/appointments',
  appointmentsRouter,
  slotsRouter,
  appointmentsProfessionalsRouter,
);
routes.use(
  '/professionals',
  professionalSpecialtiesRouter,
  professionalTypesRouter,
  professionalsRouter,
);
routes.use('/patients', patientAnamnesesRouter);
routes.use('/programs', programsRouter);
routes.use('/plans', plansRouter);
