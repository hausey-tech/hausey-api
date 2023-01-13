import { Router } from 'express';
import { celebrate } from 'celebrate';

import { CreateAppointmentSchema } from '../celebrate-schemas/appointment';
import { AppointmentsController } from '../controllers/appointments';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { upload } from '../../../shared/utils/multer-instance';

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
  upload.array('file'),
  appointmentsController.uploadFiles,
);

appointmentsRouter.get(
  '/:appointmentId/files',
  ensureAuthentication,
  appointmentsController.listFiles,
);

appointmentsRouter.get(
  '/:appointmentId/payments/toggle-paid',
  ensureAuthentication,
  appointmentsController.togglePaid,
);
