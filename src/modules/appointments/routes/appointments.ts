import { Router } from 'express';
import { AppointmentsController } from '../controllers';

export const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.get('/:appointmentId', appointmentsController.read);
