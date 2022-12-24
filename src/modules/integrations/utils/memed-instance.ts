import axios from 'axios';

export const memedInstance = axios.create({
  baseURL: process.env.MEMED_URL,
  params: {
    'api-key': process.env.MEMED_API_KEY,
    'secret-key': process.env.MEMED_SECRET_KEY,
  },
});
