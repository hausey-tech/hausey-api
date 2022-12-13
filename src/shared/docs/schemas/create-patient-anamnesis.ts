export const createPatientAnamnesisSchema = {
  type: 'object',
  properties: {
    patientId: {
      type: 'string',
    },
    appointmentId: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
  required: ['patientId', 'appointmentId', 'description'],
};
