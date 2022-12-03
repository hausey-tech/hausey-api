import { Router } from 'express';
import { celebrate } from 'celebrate';

import { AppointmentsController } from '../controllers/appointments';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { CreateAppointmentSchema } from '../celebrate-schemas/appointment';

export const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.get(
  '/:appointmentId',
  ensureAuthentication,
  appointmentsController.read,
);

appointmentsRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreateAppointmentSchema),
  appointmentsController.create,
);

appointmentsRouter.get(
  '/prices/:professionalTypeId/:professionalSpecialtyId',
  ensureAuthentication,
  appointmentsController.checkPrice,
);
