import { professionalSpecialtySchema } from './professional-specialty';
import { professionalTypeSchema } from './professional-type';
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
        professinalTypeId: {
          type: 'string',
        },
        professionalType: professionalTypeSchema,
        professionalSpecialtyId: {
          type: 'string',
        },
        professionalSpecialty: professionalSpecialtySchema,
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
      },
    },
  ],
};
