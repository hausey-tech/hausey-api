import { Router } from 'express';
import { celebrate } from 'celebrate';

import { CreateUserAndProfessionalSchema } from '../celebrate-schemas/professional';
import { ProfessionalsController } from '../controllers/professionals';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';

export const professionalsRouter = Router();
const professionalsController = new ProfessionalsController();

professionalsRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreateUserAndProfessionalSchema),
  professionalsController.create,
);
