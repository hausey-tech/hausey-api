import axios from 'axios';

export const pagarmeInstance = axios.create({
  baseURL: process.env.PAGARME_URL,
  auth: {
    username: 'sk_test_0a8a4879efa442819e9d03aeaf9a358e',
    password: '',
  },
});
