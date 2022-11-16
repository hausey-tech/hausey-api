import { Router } from 'express';
import { SlotsController } from '../controllers';

export const slotsRouter = Router();
const slotsController = new SlotsController();

slotsRouter.get('/slots/:specialtyId', slotsController.index);
slotsRouter.post('/slots', slotsController.create);
