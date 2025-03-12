import { Joi, Segments } from 'celebrate';

export const CreateProfessionalSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    document: Joi.string().required(),
    specialties: Joi.array().items(Joi.string().uuid().required()),
    registrationUf: Joi.string().length(2),
    registration: Joi.string(),
    phoneNumber: Joi.string().required(),
    sex: Joi.string().equal('M', 'F').required(),
    roleId: Joi.string().required(),
    professionalTimezone: Joi.string().required().default('America/Sao_Paulo'),
    birthdate: Joi.string()
      .required()
      // eslint-disable-next-line no-useless-escape
      .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, {
        name: 'YYYY-MM-DD',
      }),
    password: Joi.string(),
  }),
};

export const FindProfessionalsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    specialtyId: Joi.string(),
    professionalId: Joi.string().uuid(),
    typeId: Joi.string(),
  }),
};

export const UpdateProfessionalSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    professionalId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    document: Joi.string(),
    specialties: Joi.array().items(Joi.string().uuid()),
    registrationUf: Joi.string().length(2),
    registration: Joi.string(),
    phoneNumber: Joi.string(),
    sex: Joi.string().equal('M', 'F'),
    roleId: Joi.string(),
    birthdate: Joi.string()
      // eslint-disable-next-line no-useless-escape
      .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, {
        name: 'YYYY-MM-DD',
      }),
  }),
};
export const UpdatePasswordSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};
export const DeleteProfessionalSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    professionalId: Joi.string().uuid().required(),
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
