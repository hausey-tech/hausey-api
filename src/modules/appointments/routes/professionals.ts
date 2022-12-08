import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { FindProfessionalAppointmentsSchema } from '../celebrate-schemas/professional';
import { ProfessionalsController } from '../controllers/professional';

export const professionalsRouter = Router();
const professionalsController = new ProfessionalsController();

professionalsRouter.get(
  '/professionals/:professionalId',
  ensureAuthentication,
  celebrate(FindProfessionalAppointmentsSchema),
  professionalsController.index,
);
