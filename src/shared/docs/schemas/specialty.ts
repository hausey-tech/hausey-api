export const specialtySchema = {
  allOf: [
    {
      $ref: '#/schemas/base',
    },
    {
      type: 'object',
      properties: {
        professionalTypeId: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        price: {
          type: 'integer',
        },
        group: {
          type: 'string',
        },
        memedId: {
          type: 'string',
        },
      },
    },
  ],
};
