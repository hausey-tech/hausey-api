export const anamnesisAndPrimaryDiagnosisSchema = {
  allOf: [
    {
      $ref: '#/schemas/base',
    },
    {
      type: 'object',
      properties: {
        description: {
          type: 'string',
        },
      },
    },
  ],
};
