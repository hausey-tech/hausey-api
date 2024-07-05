import { Joi, Segments } from 'celebrate';

export const CreatePagarmeBoletoOrderSchema = {
  [Segments.BODY]: Joi.object().keys({
    planId: Joi.string().uuid().required(),
    quantity: Joi.number().required(),
    userId: Joi.string().uuid().required(),
    customer: Joi.object()
      .keys({
        name: Joi.string().required(),
        type: Joi.string().valid('individual', 'company').required(),
        document: Joi.string().required(),
      })
      .required(),
  }),
};
