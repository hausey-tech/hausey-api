export const specialtySchema = {
  allOf: [
    {
      $ref: '#/schemas/base',
    },
    {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
  ],
};
