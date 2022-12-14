import { Joi, Segments } from 'celebrate';

export const FindProfessionalAppointmentsSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    professionalId: Joi.string().uuid(),
  }),
};

export const SetAppointmentProfessionalSchema = {
  [Segments.BODY]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
    professionalId: Joi.string().uuid().required(),
  }),
};
