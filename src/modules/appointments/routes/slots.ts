import { celebrate } from 'celebrate';
import { Router } from 'express';

import { CreateSlotSchema } from '../celebrate-schemas';
import { SlotsController } from '../controllers';

export const slotsRouter = Router();
const slotsController = new SlotsController();

slotsRouter.get('/slots/:specialtyId', slotsController.index);
slotsRouter.post('/slots', celebrate(CreateSlotSchema), slotsController.create);
