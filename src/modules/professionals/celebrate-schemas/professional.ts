import { Joi, Segments } from 'celebrate';

export const CreateUserAndProfessionalSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    cpf: Joi.string().required(),
    professionalTypeId: Joi.string().uuid().required(),
    professionalSpecialtyId: Joi.string().uuid(),
    registrationUf: Joi.string().length(2).required(),
    registration: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    birthdate: Joi.string()
      .required()
      // eslint-disable-next-line no-useless-escape
      .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, {
        name: 'YYYY-MM-DD',
      }),
    specialtyRegistration: Joi.string(),
    password: Joi.string(),
  }),
};

export const FindProfessionalsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    specialtyId: Joi.string(),
    typeId: Joi.string(),
  }),
};
