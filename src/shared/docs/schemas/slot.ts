export const slotSchema = {
  type: 'object',
  properties: {
    weekDay: {
      type: 'integer',
    },
    slots: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
