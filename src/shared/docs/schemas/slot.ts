export const slotSchema = {
  type: 'object',
  properties: {
    formattedDate: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    slots: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
