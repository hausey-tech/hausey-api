export const createAnamnesisAndPrimaryDiagnosisSchema = {
  type: 'object',
  properties: {
    appointmentId: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
  required: ['appointmentId', 'description'],
};
