import { Joi, Segments } from 'celebrate';

export const FindAppointmentsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    patientId: Joi.string().uuid(),
    professionalId: Joi.alternatives().try(
      Joi.string().uuid(),
      Joi.string().valid('null', '!null'),
    ),
    finished: Joi.boolean(),
    appointmentId: Joi.string().uuid(),
    page: Joi.number().default(1),
    perPage: Joi.number().default(10),
    status: Joi.string(),
    emergency: Joi.string(),
    country: Joi.string(),
    date: Joi.string(),
  }),
};

export const CreateAppointmentSchema = {
  [Segments.BODY]: Joi.object().keys({
    professionalId: Joi.string().uuid(),
    patientId: Joi.string().uuid().required(),
    date: Joi.string().required(),
    emergency: Joi.boolean(),
  }),
};

export const SetProfessionalSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
    professionalId: Joi.string().uuid().required(),
  }),
};

export const UpdateAppointmentSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    anamnesis: Joi.string(),
    primaryDiagnosis: Joi.string(),
    date: Joi.string(),
    professionalId: Joi.string().uuid(),
    patientId: Joi.string().uuid(),
    emergency: Joi.boolean(),
    status: Joi.string(),
  }),
};

export const CheckPriceSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    specialtyId: Joi.string().uuid().required(),
  }),
};

export const ToggleFinishedSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
  }),
};
