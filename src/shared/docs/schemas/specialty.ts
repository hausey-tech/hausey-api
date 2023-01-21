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
