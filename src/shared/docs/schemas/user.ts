export const userSchema = {
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
        email: {
          type: 'string',
        },
        cpf: {
          type: 'string',
        },
        birthdate: {
          type: 'string',
        },
        sex: {
          type: 'integer',
        },
        phoneNumber: {
          type: 'string',
        },
      },
    },
  ],
};
