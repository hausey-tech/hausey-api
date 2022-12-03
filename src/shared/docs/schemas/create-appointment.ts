export const createAppointmentSchema = {
  type: 'object',
  properties: {
    professionalSpecialtyId: {
      type: 'string',
    },
    professionalTypeId: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
  },
  required: ['date'],
};
