import { Joi, Segments } from 'celebrate';

export const FindAppointmentsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    patientId: Joi.string().uuid(),
    professionalId: Joi.alternatives().try(
      Joi.string().uuid(),
      Joi.string().valid('null', '!null'),
    ),
    finished: Joi.boolean(),
  }),
};

export const CreateAppointmentSchema = {
  [Segments.BODY]: Joi.object().keys({
    specialtyId: Joi.string().uuid().required(),
    date: Joi.string().required(),
    card: Joi.alternatives(
      Joi.string(),
      Joi.object().keys({
        number: Joi.string().required(),
        expMonth: Joi.number().required(),
        expYear: Joi.number().required(),
        cvc: Joi.string().required(),
      }),
    ).required(),
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
