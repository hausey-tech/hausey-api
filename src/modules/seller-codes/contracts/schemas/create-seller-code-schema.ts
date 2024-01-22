import { Joi, Segments } from 'celebrate';

export const CreateSellerCodeSchema = {
  [Segments.BODY]: Joi.object().keys({
    code: Joi.string().required(),
    sellerId: Joi.string().uuid().required(),
  }),
};
