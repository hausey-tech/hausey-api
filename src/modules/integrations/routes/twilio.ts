import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { CreateRoomSchema } from '../celebrate-schemas/twilio';
import { TwilioController } from '../controllers/twilio';

export const twilioRouter = Router();
const twilioController = new TwilioController();

twilioRouter.post(
  '/twilio',
  ensureAuthentication,
  celebrate(CreateRoomSchema),
  twilioController.create,
);
