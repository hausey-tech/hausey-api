import { Joi, Segments } from 'celebrate';

export const CreatePlanSchema = {
  [Segments.BODY]: Joi.object()
    .keys({
      name: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().required(),
      type: Joi.string().valid('individual', 'family').default('individual'),
      maxDependents: Joi.number().integer().min(0).default(0),
    })
    .when(Joi.object({ type: 'family' }).unknown(), {
      then: Joi.object({
        maxDependents: Joi.number().integer().min(1).required(),
      }),
    }),
  [Segments.QUERY]: Joi.object().keys({
    regions: Joi.string(),
  }),
};
