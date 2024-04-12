import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  FindSlotsSchema,
  CreateSlotSchema,
  DeleteSlotSchema,
} from '../celebrate-schemas/slot';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { SlotsController } from '../controllers/slots';

export const slotsRouter = Router();
const slotsController = new SlotsController();

slotsRouter.get(
  '/',
  ensureAuthentication,
  celebrate(FindSlotsSchema),
  slotsController.index,
);
slotsRouter.get(
  '/:slotId/delete',
  ensureAuthentication,
  celebrate(DeleteSlotSchema),
  slotsController.delete,
);

slotsRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreateSlotSchema),
  slotsController.create,
);
