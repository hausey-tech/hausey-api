import axios from 'axios';

export const pagarmeInstance = axios.create({
  baseURL: process.env.PAGARME_URL,
  auth: {
    username: process.env.PAGARME_SECRET_KEY,
    password: '',
  },
});
