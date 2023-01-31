import { celebrate } from 'celebrate';
import { Router } from 'express';

import { CreateProfessionalAddressSchema } from '../celebrate-schemas/professional-address';
import { ProfessionalAddressesController } from '../controllers/professional-addresses';

export const professionalAddressesRouter = Router();
const professionalAddressesController = new ProfessionalAddressesController();

professionalAddressesRouter.post(
  '/:professionalId/addresses',
  celebrate(CreateProfessionalAddressSchema),
  professionalAddressesController.create,
);
