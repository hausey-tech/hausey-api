import { Joi, Segments } from 'celebrate';

export const CreateTeamProfessionalSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    teamId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    professionalId: Joi.string().uuid().required(),
    responsible: Joi.boolean(),
  }),
};
