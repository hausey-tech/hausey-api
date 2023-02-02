import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  CreatePrescriptionSchema,
  DeletePrescriptionSchema,
} from '../celebrate-schemas/prescription';
import { PrescriptionsController } from '../controllers/prescriptions';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';

export const prescriptionsRouter = Router();
const prescriptionsController = new PrescriptionsController();

prescriptionsRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreatePrescriptionSchema),
  prescriptionsController.create,
);

prescriptionsRouter.delete(
  '/:externalId',
  ensureAuthentication,
  celebrate(DeletePrescriptionSchema),
  prescriptionsController.delete,
);
