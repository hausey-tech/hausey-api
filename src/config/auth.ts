export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '14d',
    refreshExpiresIn: '5y',
  },
  apiKey: 'CoSJJLFwA64fKPTC1H4Iwt9oisI0luVl',
};
