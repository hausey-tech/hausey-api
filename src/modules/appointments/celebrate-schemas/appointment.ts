import { Joi, Segments } from 'celebrate';

export const FindAppointmentsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    patientId: Joi.string().uuid(),
    professionalId: Joi.alternatives().try(
      Joi.string().uuid(),
      Joi.string().valid('null', '!null'),
    ),
  }),
};

export const CreateAppointmentSchema = {
  [Segments.BODY]: Joi.object().keys({
    specialtyId: Joi.string().uuid().required(),
    date: Joi.string().required(),
  }),
};

export const SetProfessionalSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
    professionalId: Joi.string().uuid().required(),
  }),
};
