import { Joi, Segments } from 'celebrate';

export const CreateSellerCodeSchema = {
  [Segments.BODY]: Joi.object().keys({
    code: Joi.string().required(),
    sellerId: Joi.string().uuid().required(),
    discounts: Joi.array().items(
      Joi.object().keys({
        planId: Joi.string().required(),
        discount: Joi.number().required(),
      }),
    ),
    fee: Joi.number().default(20),
    maxUse: Joi.number(),
    free: Joi.boolean(),
    type: Joi.string(),
  }),
};
