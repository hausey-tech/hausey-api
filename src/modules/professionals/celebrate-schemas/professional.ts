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
    typeId: Joi.string(),
  }),
};
