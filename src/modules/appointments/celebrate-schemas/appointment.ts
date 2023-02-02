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

export const CreatePrescriptionSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    prescriptionId: Joi.string().uuid().required(),
  }),
};

export const DeletePrescriptionSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
    prescriptionId: Joi.string().uuid().required(),
  }),
};
