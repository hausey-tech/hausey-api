import { Router } from 'express';

import { sessionsRouter } from '../../modules/sessions/routes/sessions';

import { appointmentsRouter } from '../../modules/appointments/routes/appointments';
import { slotsRouter } from '../../modules/appointments/routes/slots';
import { anamnesesRouter } from '../../modules/appointments/routes/anamneses';
import { primaryDiagnosesRouter } from '../../modules/appointments/routes/primary-diagnoses';
import { specialtiesRouter as appointmentsSpecialtiesRouter } from '../../modules/appointments/routes/specialties';

import { specialtiesRouter } from '../../modules/professionals/routes/specialties';
import { professionalsRouter } from '../../modules/professionals/routes/professionals';
import { professionalAddressesRouter } from '../../modules/professionals/routes/professional-addresses';

import { programsRouter } from '../../modules/programs/routes/programs';

import { plansRouter } from '../../modules/plans/routes/plans';

import { patientsRouter } from '../../modules/patients/routes/patients';
import { patientAddressesRouter } from '../../modules/patients/routes/patient-addresses';

import { twilioRouter } from '../../modules/integrations/routes/twilio';
import { memedRouter } from '../../modules/integrations/routes/memed';
import { s3Router } from '../../modules/integrations/routes/s3';

export const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use(
  '/appointments',
  appointmentsRouter,
  slotsRouter,
  anamnesesRouter,
  primaryDiagnosesRouter,
  appointmentsSpecialtiesRouter,
);
routes.use(
  '/professionals',
  professionalsRouter,
  specialtiesRouter,
  professionalAddressesRouter,
);
routes.use('/patients', patientsRouter, patientAddressesRouter);
routes.use('/programs', programsRouter);
routes.use('/plans', plansRouter);
routes.use('/integrations', twilioRouter, memedRouter, s3Router);

routes.get('/health-check', (req, res) => {
  res.send({ status: 'ok' });
});
