import { Joi, Segments } from 'celebrate';

export const CreateTeamResumeSchema = {
  [Segments.BODY]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
    professionalId: Joi.string().uuid().required(),
    observation: Joi.string().required(),
    roleId: Joi.string().uuid().required(),
  }),
};
export const FindTeamResumesSchema = {
  [Segments.QUERY]: Joi.object().keys({
    patientId: Joi.string().uuid(),
    roleId: Joi.string().uuid(),
  }),
};
