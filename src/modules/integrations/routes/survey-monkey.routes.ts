import express, { Router } from 'express';
// import bodyParser from 'body-parser';
import { SurveyMonkeyController } from '../controllers/survey-monkey-controller';

export const surveyMonkeyRouter = Router();
const surveyMonkeyController = new SurveyMonkeyController();

// surveyMonkeyRouter.use(
//   bodyParser.json({
//     type: 'application/vnd.surveymonkey.response.v1+json',
//   }),
// );

surveyMonkeyRouter.get('/', (req, res) => {
  res.send();
});

surveyMonkeyRouter.post(
  '/',
  express.raw({ type: 'application/vnd.surveymonkey.response.v1+json' }),
  surveyMonkeyController.webhook,
);
