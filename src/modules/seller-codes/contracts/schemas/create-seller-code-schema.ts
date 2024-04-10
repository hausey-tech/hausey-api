import { Joi, Segments } from 'celebrate';

export const CreateSellerCodeSchema = {
  [Segments.BODY]: Joi.object().keys({
    code: Joi.string().required(),
    sellerId: Joi.string().uuid().required(),
    promotionCodeId: Joi.string().required(),
    discount: Joi.number().default(1500),
    fee: Joi.number().default(20),
    maxUse: Joi.number(),
    free: Joi.boolean(),
  }),
};
