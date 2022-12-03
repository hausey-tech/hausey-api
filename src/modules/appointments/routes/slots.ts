import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  FindSlotsByTypeSchema,
  FindSlotsBySpecialtySchema,
  CreateSlotSchema,
} from '../celebrate-schemas/slot';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { SlotsController } from '../controllers/slots';

export const slotsRouter = Router();
const slotsController = new SlotsController();

slotsRouter.post(
  '/slots',
  ensureAuthentication,
  celebrate(CreateSlotSchema),
  slotsController.create,
);
slotsRouter.get(
  '/slots/type/:typeId',
  ensureAuthentication,
  celebrate(FindSlotsByTypeSchema),
  slotsController.index,
);
slotsRouter.get(
  '/slots/specialty/:specialtyId',
  ensureAuthentication,
  celebrate(FindSlotsBySpecialtySchema),
  slotsController.index,
);
