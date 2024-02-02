import { Router } from 'express';
import { SurveyMonkeyController } from '../controllers/survey-monkey-controller';

export const surveyMonkeyRouter = Router();
const surveyMonkeyController = new SurveyMonkeyController();

surveyMonkeyRouter.post(
  '/survey-monkey/webhook',
  surveyMonkeyController.webhook,
);
