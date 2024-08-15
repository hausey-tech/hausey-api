import { Joi, Segments } from 'celebrate';

export const CreateMessageSchema = {
  [Segments.BODY]: Joi.object().keys({
    type: Joi.string().valid('inApp', 'push').required(),
    to: Joi.alternatives(
      Joi.string(),
      Joi.array().items(Joi.string()),
    ).required(),
    title: Joi.string().empty(''),
    body: Joi.string().empty(''),
    link: Joi.string().empty(''),
    startsAt: Joi.string().empty(''),
    expiresAt: Joi.string().empty(''),
  }),
};
