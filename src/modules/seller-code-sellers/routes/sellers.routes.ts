import { Router } from 'express';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { SellerCodeSellersController } from '../controllers/SellerCodeSellersController';

export const sellersRouter = Router();
const sellerCodeSellersController = new SellerCodeSellersController();

// Rota para listar todos os registros
sellersRouter.get('/', ensureAuthentication, sellerCodeSellersController.index);
