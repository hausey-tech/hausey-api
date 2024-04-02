export const updatePatientPlanSchema = {
  type: 'object',
  properties: {
    priceId: {
      type: 'string',
    },
    periodEnd: {
      type: 'string',
    },
  },
  required: ['priceId', 'periodEnd'],
};
