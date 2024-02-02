import axios from 'axios';

export const surveyMonkeyInstance = axios.create({
  baseURL: process.env.SURVEY_MONKEY_URL,
  headers: {
    Authorization: `Bearer ${process.env.SURVEY_MONKEY_KEY}`,
  },
});
