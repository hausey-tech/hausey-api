export const priceSchema = {
  type: 'object',
  properties: {
    price: {
      type: 'integer',
    },
    discount: {
      type: 'integer',
    },
    total: {
      type: 'integer',
    },
  },
};
