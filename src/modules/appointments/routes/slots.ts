import { celebrate } from 'celebrate';
import { Router } from 'express';

import { FindSlotsSchema, CreateSlotSchema } from '../celebrate-schemas/slot';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { SlotsController } from '../controllers/slots';

export const slotsRouter = Router();
const slotsController = new SlotsController();

slotsRouter.get(
  '/slots/:specialtyId',
  ensureAuthentication,
  celebrate(FindSlotsSchema),
  slotsController.index,
);
slotsRouter.post(
  '/slots',
  ensureAuthentication,
  celebrate(CreateSlotSchema),
  slotsController.create,
);
