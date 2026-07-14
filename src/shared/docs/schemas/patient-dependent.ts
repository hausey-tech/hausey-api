export const patientDependentSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    holderId: { type: 'string', format: 'uuid' },
    dependentPatientId: { type: 'string', format: 'uuid', nullable: true },
    hasAppAccess: { type: 'boolean' },
    name: { type: 'string', nullable: true },
    birthdate: { type: 'string', nullable: true },
    cpf: { type: 'string', nullable: true },
    email: { type: 'string', nullable: true },
    status: {
      type: 'string',
      enum: ['pending', 'active', 'removed'],
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const addDependentWithAppSchema = {
  type: 'object',
  required: ['hasAppAccess', 'email'],
  properties: {
    hasAppAccess: { type: 'boolean', enum: [true] },
    email: { type: 'string', format: 'email' },
  },
};

export const addDependentWithoutAppSchema = {
  type: 'object',
  required: ['hasAppAccess', 'name'],
  properties: {
    hasAppAccess: { type: 'boolean', enum: [false] },
    name: { type: 'string' },
    birthdate: { type: 'string' },
    cpf: { type: 'string' },
  },
};

export const familyByPatientSchema = {
  type: 'object',
  properties: {
    role: {
      type: 'string',
      enum: ['holder', 'dependent'],
    },
    holder: {
      type: 'object',
      nullable: true,
      description: 'Dados do titular do plano familiar',
    },
    members: {
      type: 'array',
      items: { $ref: '#/schemas/patientDependent' },
      description:
        'Membros da família (dependentes do titular, inclusive o próprio usuário se for dependente)',
    },
  },
};
