import { celebrate } from 'celebrate';
import { Router, type RequestHandler } from 'express';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { SendNotificationSchema } from '../celebrate-schemas/send-notification-schema';
import { MessagingController } from '../controllers/messaging-controller';

export const messagingRoutes = Router();
const messagingController = new MessagingController();

messagingRoutes.post(
  '/messaging/send',
  ensureAuthentication,
  celebrate(SendNotificationSchema),
  messagingController.send as RequestHandler,
);
