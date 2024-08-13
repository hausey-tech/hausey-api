import { Router } from 'express';
import { celebrate } from 'celebrate';
import { PagarmeController } from '../controllers/pagarme-controller';
import { ListPagarmeCustomerChargesSchema } from '../contracts/schemas/list-pagarme-customer-charges-schema';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { CreatePagarmeBoletoOrderSchema } from '../contracts/schemas/create-pagarme-boleto-order-schema';

export const pagarmeRouter = Router();
const pagarmeController = new PagarmeController();

pagarmeRouter.post('/pagarme/webhook', pagarmeController.webhook);
pagarmeRouter.get(
  '/pagarme/charges/:customerId',
  ensureAuthentication,
  celebrate(ListPagarmeCustomerChargesSchema),
  pagarmeController.listCharges,
);

pagarmeRouter.post(
  '/pagarme/boleto',
  ensureAuthentication,
  celebrate(CreatePagarmeBoletoOrderSchema),
  pagarmeController.createBoletoOrder,
);

pagarmeRouter.post(
  '/pagarme/customers',
  ensureAuthentication,
  pagarmeController.createCustomer,
);
