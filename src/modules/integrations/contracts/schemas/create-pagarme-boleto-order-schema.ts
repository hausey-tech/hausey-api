import { Joi, Segments } from 'celebrate';

export const CreatePagarmeBoletoOrderSchema = {
  [Segments.BODY]: Joi.object().keys({
    price: Joi.number().required(),
    date: Joi.string().length(10).required(),
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
