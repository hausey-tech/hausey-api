import fs from 'fs';
import pathJS from 'path';
import { json, Router } from 'express';

import { stripeRoutes } from '../../modules/integrations/routes/stripe.routes';
import { stripeWebhookRoutes } from '../../modules/integrations/routes/stripe-webhook.routes';

import { sessionsRouter } from '../../modules/sessions/routes/sessions';

import { appointmentsRouter } from '../../modules/appointments/routes/appointments';

import { prescriptionsRouter } from '../../modules/prescriptions/routes/prescriptions.routes';

import { slotsRouter } from '../../modules/slots/routes/slots';

import { specialtiesRouter } from '../../modules/specialties/routes/specialties';

import { professionalsRouter } from '../../modules/professionals/routes/professionals';

import { programsRouter } from '../../modules/programs/routes/programs';

import { plansRouter } from '../../modules/plans/routes/plans';

import { patientsRouter } from '../../modules/patients/routes/patients';

import { addressesRouter } from '../../modules/addresses/routes/addresses.routes';

import { usersRouter } from '../../modules/users/routes/users';

import { rolesRouter } from '../../modules/roles/routes/roles';

import { twilioRouter } from '../../modules/integrations/routes/twilio';
import { memedRouter } from '../../modules/integrations/routes/memed';
import { s3Router } from '../../modules/integrations/routes/s3';

export const routes = Router();

routes.use('/integrations/stripe/webhook', stripeWebhookRoutes);

routes.use(json());

routes.use('/integrations', twilioRouter, memedRouter, s3Router, stripeRoutes);
routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);
routes.use('/roles', rolesRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/prescriptions', prescriptionsRouter);
routes.use('/slots', slotsRouter);
routes.use('/specialties', specialtiesRouter);
routes.use('/professionals', professionalsRouter);
routes.use('/patients', patientsRouter);
routes.use('/programs', programsRouter);
routes.use('/plans', plansRouter);
routes.use('/addresses', addressesRouter);
routes.get('/health-check', (req, res) => {
  fs.readFile(
    pathJS.join(__dirname, '../../../buildtime.txt'),
    'utf8',
    (err, data) => {
      res.send({
        status: 'ok',
        lastUpdate: new Date(Number(data.split(/\r?\n/)[0]) * 1000),
      });
    },
  );
});
