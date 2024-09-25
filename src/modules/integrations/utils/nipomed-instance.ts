import axios from 'axios';

export const nipomedInstance = axios.create({
  baseURL: process.env.NIPOMED_URL,
});
