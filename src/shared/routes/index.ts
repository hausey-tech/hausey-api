import { Router } from 'express';

import { usersRouter } from '../../modules/users/routes/users';
import { sessionsRouter } from '../../modules/users/routes/sessions';

import { appointmentsRouter } from '../../modules/appointments/routes/appointments';
import { slotsRouter } from '../../modules/appointments/routes/slots';
import { professionalsRouter as appointmentsProfessionalsRouter } from '../../modules/appointments/routes/professionals';
import { patientsRouter as appointmentsPatientsRouter } from '../../modules/appointments/routes/patients';

import { professionalSpecialtiesRouter } from '../../modules/professionals/routes/professional-specialties';
import { professionalTypesRouter } from '../../modules/professionals/routes/professional-types';
import { professionalsRouter } from '../../modules/professionals/routes/professionals';

import { programsRouter } from '../../modules/programs/routes/programs';

import { plansRouter } from '../../modules/plans/routes/plans';

import { patientsRouter } from '../../modules/patients/routes/patients';
import { patientAnamnesesRouter } from '../../modules/patients/routes/patient-anamneses';
import { patientPrimaryDiagnosesRouter } from '../../modules/patients/routes/patient-primary-diagnoses';

import { twilioRouter } from '../../modules/integrations/routes/twilio';
import { memedRouter } from '../../modules/integrations/routes/memed';
import { s3Router } from '../../modules/integrations/routes/s3';

export const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use(
  '/appointments',
  appointmentsRouter,
  slotsRouter,
  appointmentsProfessionalsRouter,
  appointmentsPatientsRouter,
);
routes.use(
  '/professionals',
  professionalSpecialtiesRouter,
  professionalTypesRouter,
  professionalsRouter,
);
routes.use(
  '/patients',
  patientsRouter,
  patientAnamnesesRouter,
  patientPrimaryDiagnosesRouter,
);
routes.use('/programs', programsRouter);
routes.use('/plans', plansRouter);
routes.use('/integrations', twilioRouter, memedRouter, s3Router);

routes.get('/health-check', (req, res) => {
  res.send({ status: 'ok' });
});
