import { Joi, Segments } from 'celebrate';

export const CreateTeamSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    patientLimit: Joi.number().required(),
  }),
};
