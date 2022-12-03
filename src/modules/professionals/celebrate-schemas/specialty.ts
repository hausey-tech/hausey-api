import { Joi, Segments } from 'celebrate';

export const FindSpecialtiesByTypeSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    professionalTypeId: Joi.string().uuid(),
  }),
};
