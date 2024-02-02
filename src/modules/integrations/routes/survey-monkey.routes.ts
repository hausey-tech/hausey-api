import express, { Router } from 'express';
import { SurveyMonkeyController } from '../controllers/survey-monkey-controller';

export const surveyMonkeyRouter = Router();
const surveyMonkeyController = new SurveyMonkeyController();

// surveyMonkeyRouter.use(
//   bodyParser.json({
//     type: 'application/vnd.surveymonkey.response.v1+json',
//   }),
// );

surveyMonkeyRouter.get('/survey-monkey/webhook', (req, res) => {
  res.send();
});

surveyMonkeyRouter.post(
  '/survey-monkey/webhook',
  express.raw({ type: 'application/vnd.surveymonkey.response.v1+json' }),
  surveyMonkeyController.webhook,
);
