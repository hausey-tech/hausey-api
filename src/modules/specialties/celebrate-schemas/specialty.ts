import { Joi, Segments } from 'celebrate';

export const FindSpecialtiesSchema = {
  [Segments.QUERY]: Joi.object().keys({
    available: Joi.string().valid('true'),
  }),
};
