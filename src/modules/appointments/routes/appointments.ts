import { Router } from 'express';

import { AppointmentsController } from '../controllers/appointments';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';

export const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.get(
  '/:appointmentId',
  ensureAuthentication,
  appointmentsController.read,
);
