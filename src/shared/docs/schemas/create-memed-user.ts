export const createMemedUserSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
        },
        attributes: {
          type: 'object',
          properties: {
            external_id: {
              type: 'string',
            },
            nome: {
              type: 'string',
            },
            sobrenome: {
              type: 'string',
            },
            data_nascimento: {
              type: 'string',
            },
            cpf: {
              type: 'string',
            },
            uf: {
              type: 'string',
            },
            sexo: {
              type: 'string',
            },
            crm: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
