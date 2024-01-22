import { Joi, Segments } from 'celebrate';

export const ListPatientsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    professionalId: Joi.string().uuid(),
  }),
};

export const CreatePatientSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    sellerCode: Joi.string(),
  }),
};

export const UpdatePatientSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    sellerCode: Joi.string().max(6),
    document: Joi.string(),
    birthdate: Joi.string(),
    fcmToken: Joi.string(),
    sex: Joi.string().equal('M', 'F'),
  }),
};

export const GetPatientInfosSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
  }),
};
