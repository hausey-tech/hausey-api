import { Router } from 'express';
import { celebrate } from 'celebrate';

import { CreateAnamnesisSchema } from '../celebrate-schemas/anamnesis';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { AnamnesesController } from '../controllers/anamneses';

export const anamnesesRouter = Router();
const anamnesesController = new AnamnesesController();

anamnesesRouter.post(
  '/anamneses',
  ensureAuthentication,
  celebrate(CreateAnamnesisSchema),
  anamnesesController.create,
);

anamnesesRouter.patch(
  '/anamneses',
  ensureAuthentication,
  celebrate(CreateAnamnesisSchema),
  anamnesesController.update,
);
