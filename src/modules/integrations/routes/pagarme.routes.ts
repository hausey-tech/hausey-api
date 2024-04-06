import { Router } from 'express';
import { PagarmeController } from '../controllers/pagarme-controller';

export const pagarmeRouter = Router();
const pagarmeController = new PagarmeController();

pagarmeRouter.post('/pagarme/webhook', pagarmeController.webhook);
