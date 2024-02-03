import { Joi, Segments } from 'celebrate';

export const SendNotificationSchema = {
  [Segments.BODY]: Joi.object()
    .keys({
      userId: Joi.string().uuid(),
      professionalId: Joi.string().uuid(),
      patientId: Joi.string().uuid(),
      message: Joi.string().required(),
    })
    .or('userId', 'storeId'),
};
