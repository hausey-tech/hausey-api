import axios from 'axios';

const SURVEY_MONKEY_ACCESS_TOKEN =
  'gwIkzT39rNtoaYdrzi-0vzQqg.tCH4KITJvwmZMx3itSpcrBWJ6GXzFxRKcaTPQqBoxazAvWcvAzdQC-mQWeZsDX35eQHYscH.c3hGyx8A.VAWf8-9xG5Jq2RhMH9XnV';

export const surveyMonkeyInstance = axios.create({
  baseURL: process.env.MEMED_URL,
  headers: {
    Authorization: `Bearer ${SURVEY_MONKEY_ACCESS_TOKEN}`,
  },
});
