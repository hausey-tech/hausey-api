import { Router } from 'express';

import { AppointmentsController } from '../controllers';
import { ensureAuthentication } from '../../users/middlewares';

export const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.get(
  '/:appointmentId',
  ensureAuthentication,
  appointmentsController.read,
);
