import { Router } from 'express';
import { AlertProfessionalController } from '../controllers/alertProfessional.controller';

export const alertProfessionalRouter = Router();
const alertProfessionalController = new AlertProfessionalController();

alertProfessionalRouter.get('/', alertProfessionalController.create);
alertProfessionalRouter.post(
  '/webhook/call-status',
  alertProfessionalController.webhook,
);
