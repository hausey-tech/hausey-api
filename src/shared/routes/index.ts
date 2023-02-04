import { Router } from 'express';
import { AppError } from '../errors/app-error';

import { sessionsRouter } from '../../modules/sessions/routes/sessions';

import { appointmentsRouter } from '../../modules/appointments/routes/appointments';

import { prescriptionsRouter } from '../../modules/prescriptions/routes/prescriptions.routes';

import { slotsRouter } from '../../modules/slots/routes/slots';

import { specialtiesRouter } from '../../modules/specialties/routes/specialties';

import { professionalsRouter } from '../../modules/professionals/routes/professionals';

import { programsRouter } from '../../modules/programs/routes/programs';

import { plansRouter } from '../../modules/plans/routes/plans';

import { patientsRouter } from '../../modules/patients/routes/patients';
import { patientAddressesRouter } from '../../modules/patients/routes/patient-addresses';

import { twilioRouter } from '../../modules/integrations/routes/twilio';
import { memedRouter } from '../../modules/integrations/routes/memed';
import { s3Router } from '../../modules/integrations/routes/s3';

export const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/prescriptions', prescriptionsRouter);
routes.use('/slots', slotsRouter);
routes.use('/specialties', specialtiesRouter);
routes.use('/professionals', professionalsRouter);
routes.use('/patients', patientsRouter, patientAddressesRouter);
routes.use('/programs', programsRouter);
routes.use('/plans', plansRouter);
routes.use('/integrations', twilioRouter, memedRouter, s3Router);
routes.get('/health-check', (req, res) => {
  res.send({ status: 'ok' });
});
routes.use('/', () => {
  throw new AppError('Rota não encontrada, verifique e tente novamente!', 404);
});
