import { Joi, Segments } from 'celebrate';

export const DeleteFileFromFirebaseSchema = {
  [Segments.BODY]: Joi.object().keys({
    url: Joi.string().required(),
  }),
};
