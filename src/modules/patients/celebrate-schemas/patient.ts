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
export const GetPatientsByGroupSchema = {
  [Segments.BODY]: Joi.object().keys({
    groupTypes: Joi.array().items(Joi.string().required()).required(),
  }),
};
export const CreatePatientGroupSchema = {
  [Segments.BODY]: Joi.object().keys({
    observations: Joi.string().required(),
    roleId: Joi.string().uuid().required(),
    patientId: Joi.string().uuid().required(),
    groupTypes: Joi.array().items(Joi.string().required()).required(),
  }),
};
export const CreatePatientProfessionalAssistanceSchema = {
  [Segments.BODY]: Joi.object().keys({
    roleId: Joi.string().uuid().required(),
    patientId: Joi.string().uuid().required(),
    assistanceType: Joi.string().equal('Grupo', 'Individual').required(),
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
    responsibleDoctorId: Joi.string().uuid(),
  }),
};

export const GetPatientInfosSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
  }),
};
