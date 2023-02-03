import { Router } from 'express';
import { celebrate } from 'celebrate';

import { CreatePrescriptionSchema } from '../contracts/schemas/CreatePrescriptionSchema';
import { DeletePrescriptionSchema } from '../contracts/schemas/DeletePrescriptionSchema';
import { PrescriptionsController } from '../controllers/PrescriptionsController';
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
