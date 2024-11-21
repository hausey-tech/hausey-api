import { Joi, Segments } from 'celebrate';

export const CreateAccountLinkSchema = {
  [Segments.BODY]: Joi.object().keys({
    userId: Joi.string().uuid().required(),
    type: Joi.string().valid('account_onboarding', 'account_update').required(),
  }),
};
