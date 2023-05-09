export const createAppointmentSchema = {
  type: 'object',
  properties: {
    specialtyId: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
  },
  required: ['date'],
};
