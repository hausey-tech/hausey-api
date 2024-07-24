import { Joi, Segments } from 'celebrate';

export const FindAllGroupTypesSchema = {
  [Segments.QUERY]: Joi.object().keys({
    withSpecialty: Joi.string().valid('true', 'false'),
  }),
};
