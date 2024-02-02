import { Router } from 'express';
import { SurveyMonkeyController } from '../controllers/survey-monkey-controller';

export const surveyMonkeyRouter = Router();
const surveyMonkeyController = new SurveyMonkeyController();

surveyMonkeyRouter.get('/survey-monkey/webhook', (req, res) => {
  res.send();
});

surveyMonkeyRouter.post(
  '/survey-monkey/webhook',
  surveyMonkeyController.webhook,
);
