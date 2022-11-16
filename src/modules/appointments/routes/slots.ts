import { celebrate } from 'celebrate';
import { Router } from 'express';

import { FindSlotsSchema, CreateSlotSchema } from '../celebrate-schemas';
import { ensureAuthentication } from '../../users/middlewares';
import { SlotsController } from '../controllers';

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
