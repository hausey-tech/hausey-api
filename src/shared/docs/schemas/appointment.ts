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
        professionalSpecialtyId: {
          type: 'string',
        },
        professionalId: {
          type: 'string',
        },
        patientId: {
          type: 'string',
        },
        date: {
          type: 'string',
        },
      },
    },
  ],
};
