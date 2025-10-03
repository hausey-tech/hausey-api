import { inject, injectable } from 'tsyringe';
import { surveyMonkeyInstance } from '../../utils/survey-monkey-instance';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { AppError } from '../../../../shared/errors/app-error';
import { brevo } from '../../../../shared/utils/brevo';

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

      const document = response.pages[0].questions[1].answers[0].text.replace(
        /[^\d]/g,
        '',
      );
      const patient = await this.patientsRepository.findByDocument(document);
      if (!patient) {
        throw new AppError('Paciente não encontrado!');
      }
      const questionnaireUrl = response.edit_url;
      patient.questionnaireUrl = questionnaireUrl;

      const patientStringfied = JSON.stringify(patient);

      brevo({
        to: 'adm.hausey@gmail.com',
        subject: `📜Novo questionário respondido!`,
        body: `
        <h2>Olá, um novo paciente respondeu o questionário e já pode ser avaliado!</h2>
        <h4>Veja as informações:</h4>
        <p>Nome: <b>${patient.name}</b></p>
        <p>Email: <b>${patient.email}</b></p>
        <p>Telefone: <b>${patient.phoneNumber}</b></p>
        <a href=${
          patient.questionnaireUrl
        } target="_blank">Url do Questionário: ${patient.questionnaireUrl}</a>
        <p>Clique no link abaixo para acessar o paciente no portal:</p>
      <a href=${`https://hausey.com.br/doctor/patientsDetails?patient=${patientStringfied}`} target="_blank">Ver paciente<a/>
      `,
      });
      await this.patientsRepository.save(patient);
    }
  }
}
