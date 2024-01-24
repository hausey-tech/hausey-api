import { celebrate } from 'celebrate';
import { Router } from 'express';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';

import { ClinicalResumeController } from '../controllers/clinical-resumes';
import { CreateClinicalResumeSchema } from '../contracts/schemas/clinical-resume-schemas';

export const clinicalResumeRouter = Router();
const clinicalResumeController = new ClinicalResumeController();

clinicalResumeRouter.get(
  '/',
  ensureAuthentication,
  clinicalResumeController.index,
);
clinicalResumeRouter.post(
  '/',
  celebrate(CreateClinicalResumeSchema),
  clinicalResumeController.create,
);
