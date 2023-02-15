import { Joi, Segments } from 'celebrate';

export const ListCardsSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    customerId: Joi.string().required(),
  }),
};

export const CreateSubscriptionSchema = {
  [Segments.BODY]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
    priceId: Joi.string().required(),
    card: Joi.alternatives(
      Joi.string(),
      Joi.object().keys({
        number: Joi.string().required(),
        expMonth: Joi.number().required(),
        expYear: Joi.number().required(),
        cvc: Joi.string().required(),
      }),
    ).required(),
  }),
};
