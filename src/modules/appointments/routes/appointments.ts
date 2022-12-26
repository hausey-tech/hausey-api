import { Router } from 'express';
import { celebrate } from 'celebrate';
import multer from 'multer';

import { AppointmentsController } from '../controllers/appointments';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { CreateAppointmentSchema } from '../celebrate-schemas/appointment';

const upload = multer({ dest: 'tmp/' });

export const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.get('/', ensureAuthentication, appointmentsController.index);

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

appointmentsRouter.post(
  '/:appointmentId/files',
  ensureAuthentication,
  upload.single('file'),
  appointmentsController.uploadFiles,
);

appointmentsRouter.get(
  '/:appointmentId/files',
  ensureAuthentication,
  appointmentsController.listFiles,
);
