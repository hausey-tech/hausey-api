import { Joi, Segments } from 'celebrate';

export const ListMedicalRecordsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
  }),
};
