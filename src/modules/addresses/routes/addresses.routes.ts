import { celebrate } from 'celebrate';
import { Router } from 'express';

import { CreateAddressSchema } from '../contracts/schemas/CreateAddressSchema';
import { AddressesController } from '../controllers/AddressesController';

export const addressesRouter = Router();
const addressesController = new AddressesController();

addressesRouter.post(
  '/',
  celebrate(CreateAddressSchema),
  addressesController.create,
);
