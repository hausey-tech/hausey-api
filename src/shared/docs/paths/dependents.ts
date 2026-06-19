const security = [{ bearerAuth: [] }];

export const dependentsPath = {
  post: {
    tags: ['Dependents'],
    summary: 'Adicionar dependente ao plano familiar',
    description:
      'Titular autenticado adiciona um dependente. Com acesso ao app: envia convite por email. Sem acesso: cria conta Patient vinculada.',
    security,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                title: 'Com acesso ao app',
                type: 'object',
                required: ['hasAppAccess', 'email'],
                properties: {
                  hasAppAccess: { type: 'boolean', enum: [true] },
                  email: { type: 'string', format: 'email' },
                },
              },
              {
                title: 'Sem acesso ao app',
                type: 'object',
                required: ['hasAppAccess', 'name'],
                properties: {
                  hasAppAccess: { type: 'boolean', enum: [false] },
                  name: { type: 'string' },
                  birthdate: { type: 'string' },
                  cpf: { type: 'string' },
                },
              },
            ],
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Dependente adicionado',
        content: {
          'application/json': {
            schema: { $ref: '#/schemas/patientDependent' },
          },
        },
      },
      400: { $ref: '#/components/badRequest' },
      401: { $ref: '#/components/unauthorized' },
    },
  },
  get: {
    tags: ['Dependents'],
    summary: 'Listar dependentes do titular',
    security,
    responses: {
      200: {
        description: 'Lista de dependentes',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/schemas/patientDependent' },
            },
          },
        },
      },
      401: { $ref: '#/components/unauthorized' },
    },
  },
  dependentId: {
    delete: {
      tags: ['Dependents'],
      summary: 'Remover dependente',
      security,
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'string', format: 'uuid' },
          required: true,
        },
      ],
      responses: {
        204: { description: 'Dependente removido' },
        401: { $ref: '#/components/unauthorized' },
        404: { $ref: '#/components/notFound' },
      },
    },
    resendInvite: {
      post: {
        tags: ['Dependents'],
        summary: 'Reenviar convite para dependente',
        security,
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: { type: 'string', format: 'uuid' },
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'Convite reenviado',
            content: {
              'application/json': {
                schema: { $ref: '#/schemas/patientDependent' },
              },
            },
          },
          400: { $ref: '#/components/badRequest' },
          401: { $ref: '#/components/unauthorized' },
        },
      },
    },
  },
  acceptInvite: {
    post: {
      tags: ['Dependents'],
      summary: 'Aceitar convite (via token)',
      description:
        'Endpoint público. O paciente informa o invite_token e seu patientId para vincular ao plano familiar.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['inviteToken', 'patientId'],
              properties: {
                inviteToken: { type: 'string' },
                patientId: { type: 'string', format: 'uuid' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Convite aceito e vínculo criado',
          content: {
            'application/json': {
              schema: { $ref: '#/schemas/patientDependent' },
            },
          },
        },
        400: { $ref: '#/components/badRequest' },
        404: { $ref: '#/components/notFound' },
      },
    },
  },
  holderByDependent: {
    get: {
      tags: ['Dependents'],
      summary: 'Buscar titular e irmãos a partir de um dependente',
      security,
      parameters: [
        {
          in: 'path',
          name: 'dependentPatientId',
          schema: { type: 'string', format: 'uuid' },
          required: true,
        },
      ],
      responses: {
        200: {
          description: 'Titular e lista de dependentes',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  holder: { type: 'object' },
                  siblings: {
                    type: 'array',
                    items: { $ref: '#/schemas/patientDependent' },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/unauthorized' },
        404: { $ref: '#/components/notFound' },
      },
    },
  },
};
