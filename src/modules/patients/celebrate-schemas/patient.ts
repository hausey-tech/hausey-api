import { Joi, Segments } from 'celebrate';

export const CreatePatientSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const UpdatePatientSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    document: Joi.string(),
    birthdate: Joi.string(),
    sex: Joi.string().equal('M', 'F'),
    phoneNumber: Joi.string(),
  }),
};
