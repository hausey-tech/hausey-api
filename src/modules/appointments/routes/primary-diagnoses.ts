import { Router } from 'express';
import { celebrate } from 'celebrate';

import { CreatePrimaryDiagnosisSchema } from '../celebrate-schemas/primary-diagnosis';
import { PrimaryDiagnosesController } from '../controllers/primary-diagnoses';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';

export const primaryDiagnosesRouter = Router();
const primaryDiagnosesController = new PrimaryDiagnosesController();

primaryDiagnosesRouter.post(
  '/primary-diagnoses',
  ensureAuthentication,
  celebrate(CreatePrimaryDiagnosisSchema),
  primaryDiagnosesController.create,
);
