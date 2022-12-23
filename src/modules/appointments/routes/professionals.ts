import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { ProfessionalsController } from '../controllers/professionals';
import {
  FindProfessionalAppointmentsSchema,
  SetAppointmentProfessionalSchema,
} from '../celebrate-schemas/professional';

export const professionalsRouter = Router();
const professionalsController = new ProfessionalsController();

professionalsRouter.get(
  '/professionals/:professionalId',
  ensureAuthentication,
  celebrate(FindProfessionalAppointmentsSchema),
  professionalsController.index,
);

professionalsRouter.post(
  '/professionals',
  ensureAuthentication,
  celebrate(SetAppointmentProfessionalSchema),
  professionalsController.setAppointmentProfessional,
);
