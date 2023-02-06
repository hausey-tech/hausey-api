import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  CreateProfessionalSchema,
  FindProfessionalsSchema,
} from '../celebrate-schemas/professional';
import { ProfessionalsController } from '../controllers/professionals';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';

export const professionalsRouter = Router();
const professionalsController = new ProfessionalsController();

professionalsRouter.get(
  '/',
  ensureAuthentication,
  celebrate(FindProfessionalsSchema),
  professionalsController.index,
);

professionalsRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreateProfessionalSchema),
  professionalsController.create,
);
