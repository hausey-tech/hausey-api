import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import {
  ListPatientPrimaryDiagnosesSchema,
  CreatePatientPrimaryDiagnosisSchema,
} from '../celebrate-schemas/patient-primary-diagnosis';
import { PatientPrimaryDiagnosesController } from '../controllers/patient-primary-diagnoses';

export const patientPrimaryDiagnosesRouter = Router();
const patientPrimaryDiagnosesController =
  new PatientPrimaryDiagnosesController();

patientPrimaryDiagnosesRouter.get(
  '/primary-diagnoses',
  ensureAuthentication,
  celebrate(ListPatientPrimaryDiagnosesSchema),
  patientPrimaryDiagnosesController.index,
);

patientPrimaryDiagnosesRouter.post(
  '/primary-diagnoses',
  ensureAuthentication,
  celebrate(CreatePatientPrimaryDiagnosisSchema),
  patientPrimaryDiagnosesController.create,
);
