import { inject, injectable } from 'tsyringe';
import { surveyMonkeyInstance } from '../../utils/survey-monkey-instance';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { AppError } from '../../../../shared/errors/app-error';

interface IProps {
  name: string;
  filter_type: string;
  filter_id: string;
  event_type: string;
  event_id: string;
  event_datetime: string;
  object_type: string;
  object_id: string;
  resources: {
    respondent_id: string;
    recipient_id: string;
    survey_id: string;
    user_id: string;
    collector_id: string;
  };
}

@injectable()
export class HandleSurveyMonkeyWebhookService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(data: IProps): Promise<any> {
    const {
      event_type: eventType,
      filter_id: filterId,
      object_id: objectId,
    } = data;

    /*
      DESAFIOS:
      - PADRONIZAR O INPUT DE DOCUMENTO, NÃO SEI SE TEM COMO NO SURVEY MONKEY
      - DEIXAR SEMPRE ESSE INPUT NA MESMA POSIÇÃO
    */

    if (eventType === 'response_completed') {
      const { data: response } = await surveyMonkeyInstance.get(
        `/surveys/${filterId}/responses/${objectId}/details`,
      );

      const document = response.pages[0].questions[2].answers[0].text;
      const patient = await this.patientsRepository.findByDocument(document);
      if (!patient) {
        throw new AppError('Paciente não encontrado!');
      }
      const questionnaireUrl = response.edit_url;
      patient.questionnaireUrl = questionnaireUrl;
      await this.patientsRepository.save(patient);
    }
  }
}
