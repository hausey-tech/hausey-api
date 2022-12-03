import { Joi, Segments } from 'celebrate';

export const CreateAppointmentSchema = {
  [Segments.BODY]: Joi.object().keys({
    professionalTypeId: Joi.string().uuid(),
    professionalSpecialtyId: Joi.string().uuid(),
    date: Joi.string().required(),
  }),
};
