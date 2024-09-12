import { Joi, Segments } from 'celebrate';

export const CreatePagarmeBoletoOrderSchema = {
  [Segments.BODY]: Joi.object().keys({
    price: Joi.number().required(),
    date: Joi.string().length(10).required(),
    users: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.string().uuid().required(),
          amount: Joi.number().required(),
        }),
      )
      .required(),
    customer: Joi.object()
      .keys({
        name: Joi.string().required(),
        type: Joi.string().valid('individual', 'company').required(),
        document: Joi.string().required(),
      })
      .required(),
  }),
};
