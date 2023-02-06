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
        password: {
          type: 'string',
        },
        document: {
          type: 'string',
        },
        birthdate: {
          type: 'string',
        },
        phoneNumber: {
          type: 'string',
        },
        sex: {
          type: 'integer',
        },
      },
    },
  ],
};
