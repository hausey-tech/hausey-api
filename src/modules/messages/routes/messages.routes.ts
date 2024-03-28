import { celebrate } from 'celebrate';
import { Router, type RequestHandler } from 'express';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { CreateMessageSchema } from '../contracts/schemas/create-message-schema';
import { MessagesController } from '../controllers/messages-controller';

export const messagesRouter = Router();
const messagesController = new MessagesController();

messagesRouter.get(
  '/',
  ensureAuthentication,
  messagesController.getInAppMessage as RequestHandler,
);
messagesRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreateMessageSchema),
  messagesController.create as RequestHandler,
);
messagesRouter.post(
  '/user',
  ensureAuthentication,
  celebrate(CreateMessageSchema),
  messagesController.createMessageToUser as RequestHandler,
);
