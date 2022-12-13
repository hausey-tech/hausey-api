import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { CreatePatientAnamnesisSchema } from '../celebrate-schemas/patient-anamnesis';
import { PatientAnamnesesController } from '../controllers/patient-anamneses';

export const patientAnamnesesRouter = Router();
const patientAnamnesesController = new PatientAnamnesesController();

patientAnamnesesRouter.post(
  '/anamneses',
  ensureAuthentication,
  celebrate(CreatePatientAnamnesisSchema),
  patientAnamnesesController.create,
);
