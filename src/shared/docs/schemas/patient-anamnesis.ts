export const patientAnamnesisSchema = {
  allOf: [
    {
      $ref: '#/schemas/base',
    },
    {
      type: 'object',
      properties: {
        patientId: {
          type: 'string',
        },
        appointmentId: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
    },
  ],
};
