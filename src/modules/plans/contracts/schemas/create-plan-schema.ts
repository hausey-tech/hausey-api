import { Joi, Segments } from 'celebrate';

export const CreatePlanSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required(),
    isPro: Joi.boolean(),
    type: Joi.string().valid('Individual', 'Familiar'),
  }),
  [Segments.QUERY]: Joi.object().keys({
    regions: Joi.string(),
  }),
};
