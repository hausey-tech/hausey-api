import { Joi, Segments } from 'celebrate';

export const ListPagarmeCustomerChargesSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    customerId: Joi.string().required(),
  }),
};
