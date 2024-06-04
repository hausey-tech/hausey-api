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
    document: Joi.string(),
    sex: Joi.string().equal('M', 'F'),
    birthdate: Joi.string(),
    sellerCode: Joi.string(),
  }),
};
export const GetPatientsByGroupSchema = {
  [Segments.BODY]: Joi.object().keys({
    groupTypes: Joi.array().items(Joi.string().required()).required(),
  }),
};
export const GetGroupByPatientSchema = {
  [Segments.QUERY]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
  }),
};
export const CreatePatientFileSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    file: Joi.string().required(),
    title: Joi.string().required(),
  }),
};
export const CreatePatientGroupSchema = {
  [Segments.BODY]: Joi.object().keys({
    observations: Joi.string(),
    roleId: Joi.string().uuid().required(),
    patientId: Joi.string().uuid().required(),
    groupTypes: Joi.array().items(Joi.string().required()).required(),
  }),
};
export const CreateForwardRequestSchema = {
  [Segments.BODY]: Joi.object().keys({
    observation: Joi.string().required(),
    professionalIdFrom: Joi.string().uuid().required(),
    professionalIdTo: Joi.string().uuid().required(),
    patientId: Joi.string().uuid().required(),
  }),
};
export const CreatePatientProfessionalAssistanceSchema = {
  [Segments.BODY]: Joi.object().keys({
    roleId: Joi.string().uuid().required(),
    patientId: Joi.string().uuid().required(),
    assistanceType: Joi.string()
      .equal('Grupo', 'Individual', 'Não Necessita')
      .required(),
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
    responsibleTeamId: Joi.string().uuid(),
  }),
};
export const UpdatePatientPlanSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    priceId: Joi.string().required(),
    periodEnd: Joi.string().required(),
  }),
};

export const GetPatientInfosSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
  }),
};

export const ForgotPasswordSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
export const VerifyTokenSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    token: Joi.string().max(6).required(),
  }),
};
export const ResetPasswordSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    token: Joi.string().max(6).required(),
    password: Joi.string().min(8).required(),
  }),
};

export const CreateSubscriptionSchema = {
  [Segments.BODY]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
    planId: Joi.string().required(),
    paymentMethod: Joi.string()
      .valid('credit_card', 'debit_card', 'pix')
      .required(),
    months: Joi.when('paymentMethod', {
      is: 'pix',
      then: Joi.number().default(1),
      otherwise: Joi.forbidden(),
    }),
    cardToken: Joi.when('paymentMethod', {
      is: 'pix',
      then: Joi.forbidden(),
      otherwise: Joi.string().required(),
    }),
    address: Joi.when('paymentMethod', {
      is: 'pix',
      then: Joi.forbidden(),
      otherwise: Joi.object()
        .keys({
          street: Joi.string().required(),
          number: Joi.string().required(),
          neighborhood: Joi.string().required(),
          complement: Joi.string().max(128).empty(''),
          zipCode: Joi.string().max(16).required(),
          city: Joi.string().max(64).required(),
          state: Joi.string().length(2).required(),
          country: Joi.string().length(2).required(),
        })
        .required(),
    }),
  }),
};
