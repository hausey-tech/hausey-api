import { Joi, Segments } from 'celebrate';

export const CreatePatientAnamnesisSchema = {
  [Segments.BODY]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
    appointmentId: Joi.string().uuid().required(),
    description: Joi.string().required(),
  }),
};
