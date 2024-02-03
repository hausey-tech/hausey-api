import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HandleSurveyMonkeyWebhookService } from '../services/survey-monkey/handle-survey-monkey-webhook-service';

export class SurveyMonkeyController {
  public async webhook(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { body } = request;
    const handleSurveyMonkeyWebhookService = container.resolve(
      HandleSurveyMonkeyWebhookService,
    );
    await handleSurveyMonkeyWebhookService.execute(body);
    return response.json({ message: 'Paciente atualizado com sucesso!' });
  }
}
