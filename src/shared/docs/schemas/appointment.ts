import { specialtySchema } from './specialty';
import { professionalSchema } from './professional';
import { patientSchema } from './patient';

export const appointmentSchema = {
  allOf: [
    {
      $ref: '#/schemas/base',
    },
    {
      type: 'object',
      properties: {
        specialtyId: {
          type: 'string',
        },
        specialty: specialtySchema,
        professionalId: {
          type: 'string',
        },
        professional: professionalSchema,
        patientId: {
          type: 'string',
        },
        patient: patientSchema,
        date: {
          type: 'string',
        },
        paid: {
          type: 'boolean',
        },
      },
    },
  ],
};
