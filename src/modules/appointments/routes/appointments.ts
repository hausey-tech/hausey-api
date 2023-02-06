import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  FindAppointmentsSchema,
  CreateAppointmentSchema,
  SetProfessionalSchema,
  UpdateAppointmentSchema,
  CheckPriceSchema,
  ToggleFinishedSchema,
} from '../celebrate-schemas/appointment';
import { AppointmentsController } from '../controllers/appointments';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { upload } from '../../../shared/utils/multer-instance';

export const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.get(
  '/',
  ensureAuthentication,
  celebrate(FindAppointmentsSchema),
  appointmentsController.index,
);

appointmentsRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreateAppointmentSchema),
  appointmentsController.create,
);

appointmentsRouter.patch(
  '/:appointmentId',
  ensureAuthentication,
  celebrate(UpdateAppointmentSchema),
  appointmentsController.update,
);

appointmentsRouter.get(
  '/check-price/:specialtyId',
  ensureAuthentication,
  celebrate(CheckPriceSchema),
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
  '/:appointmentId/toggle-paid',
  ensureAuthentication,
  appointmentsController.togglePaid,
);

appointmentsRouter.get(
  '/:appointmentId/set-professional/:professionalId',
  ensureAuthentication,
  celebrate(SetProfessionalSchema),
  appointmentsController.setProfessional,
);

appointmentsRouter.get(
  '/:appointmentId/toggle-finished',
  ensureAuthentication,
  celebrate(ToggleFinishedSchema),
  appointmentsController.toggleFinished,
);
