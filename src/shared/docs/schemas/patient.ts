export const patientSchema = {
  allOf: [
    {
      $ref: '#/schemas/user',
    },
    {
      type: 'object',
      properties: {
        planId: {
          type: 'string',
        },
      },
    },
  ],
};
