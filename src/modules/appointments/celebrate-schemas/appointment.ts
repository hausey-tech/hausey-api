import { Joi, Segments } from 'celebrate';

export const CreateAppointmentSchema = {
  [Segments.BODY]: Joi.object().keys({
    specialtyId: Joi.string().uuid().required(),
    date: Joi.string().required(),
  }),
};
