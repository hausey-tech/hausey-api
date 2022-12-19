import { patientSchema } from './patient';

export const patientSessionSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
    },
    refreshToken: {
      type: 'string',
    },
    patient: patientSchema,
  },
};
