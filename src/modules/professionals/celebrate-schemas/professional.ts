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
    birthdate: Joi.string().required(),
    specialtyRegistration: Joi.string(),
  }),
};
