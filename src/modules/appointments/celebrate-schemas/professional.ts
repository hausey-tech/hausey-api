import { Joi, Segments } from 'celebrate';

export const FindProfessionalAppointmentsSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    professionalId: Joi.string().uuid(),
  }),
};
