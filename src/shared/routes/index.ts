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

import { groupTypesRouter } from '../../modules/group-type/routes/group-types';

import { patientsRouter } from '../../modules/patients/routes/patients';

import { addressesRouter } from '../../modules/addresses/routes/addresses.routes';

import { usersRouter } from '../../modules/users/routes/users';

import { rolesRouter } from '../../modules/roles/routes/roles';
import { messagingRoutes } from '../../modules/integrations/routes/messaging.routes';
import { sellerCodesRouter } from '../../modules/seller-codes/routes/seller-codes';

import { clinicalCategoryRouter } from '../../modules/clinical-categories/routes/clinical-category';

import { clinicalResumeRouter } from '../../modules/clinical-resumes/routes/clinical-resumes';
import { medicalRecordsRouter } from '../../modules/medical-records/routes/medical-records.routes';

import { messagesRouter } from '../../modules/messages/routes/messages.routes';

import { twilioRouter } from '../../modules/integrations/routes/twilio';
import { videoSdkRouter } from '../../modules/integrations/routes/video-sdk';
import { memedRouter } from '../../modules/integrations/routes/memed';
import { s3Router } from '../../modules/integrations/routes/s3';
import { surveyMonkeyRouter } from '../../modules/integrations/routes/survey-monkey.routes';

import { teamsRouter } from '../../modules/teams/routes/teams.routes';
import { teamResumeRouter } from '../../modules/team-resumes/routes/team-resumes';

export const routes = Router();

routes.use('/integrations/stripe/webhook', stripeWebhookRoutes);

routes.use(json());

routes.use(
  '/integrations',
  twilioRouter,
  memedRouter,
  s3Router,
  stripeRoutes,
  videoSdkRouter,
  surveyMonkeyRouter,
);
routes.use('/sessions', sessionsRouter);
routes.use('/messaging', messagingRoutes);
routes.use('/messages', messagesRouter);
routes.use('/group-types', groupTypesRouter);
routes.use('/users', usersRouter);
routes.use('/roles', rolesRouter);
routes.use('/seller-codes', sellerCodesRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/prescriptions', prescriptionsRouter);
routes.use('/slots', slotsRouter);
routes.use('/clinical-category', clinicalCategoryRouter);
routes.use('/clinical-resume', clinicalResumeRouter);
routes.use('/team-resume', teamResumeRouter);
routes.use('/specialties', specialtiesRouter);
routes.use('/professionals', professionalsRouter);
routes.use('/patients', patientsRouter);
routes.use('/programs', programsRouter);
routes.use('/plans', plansRouter);
routes.use('/addresses', addressesRouter);
routes.use('/medical-records', medicalRecordsRouter);
routes.use('/teams', teamsRouter);
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
