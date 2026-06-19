import { Joi, Segments } from 'celebrate';

export const AddDependentSchema = {
  [Segments.BODY]: Joi.object()
    .keys({
      hasAppAccess: Joi.boolean().required(),
      email: Joi.when('hasAppAccess', {
        is: true,
        then: Joi.string().email().required(),
        otherwise: Joi.forbidden(),
      }),
      name: Joi.when('hasAppAccess', {
        is: false,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      birthdate: Joi.string().optional(),
      cpf: Joi.string().optional(),
    })
    .options({ allowUnknown: false }),
};

export const RemoveDependentSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

export const AcceptInviteSchema = {
  [Segments.BODY]: Joi.object().keys({
    inviteToken: Joi.string().required(),
    patientId: Joi.string().uuid().required(),
  }),
};

export const ResendInviteSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

export const GetHolderByDependentSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    dependentPatientId: Joi.string().uuid().required(),
  }),
};
