import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { CreateSellerCodeSchema } from '../contracts/schemas/create-seller-code-schema';
import { SellerCodesController } from '../controller/seller-codes';

export const sellerCodesRouter = Router();
const sellerCodesController = new SellerCodesController();

sellerCodesRouter.get('/', ensureAuthentication, sellerCodesController.index);
sellerCodesRouter.post(
  '/',
  celebrate(CreateSellerCodeSchema),
  sellerCodesController.create,
);
sellerCodesRouter.post(
  '/code',
  ensureAuthentication,
  sellerCodesController.findSellerCode,
);
