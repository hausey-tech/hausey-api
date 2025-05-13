import { Router } from 'express';
import { WhatsappController } from './whatsapp.controller';

const whatsappRouter = Router();
const controller = new WhatsappController();

// POST /v1/whatsapp/webhook
whatsappRouter.post('/webhook', controller.handleIncomingMessage);

export { whatsappRouter };
