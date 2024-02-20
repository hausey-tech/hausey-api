import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { mailer } from '../../../shared/utils/mailer';

@injectable()
export class CreateForwardRequest {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(payload: {
    patientId: string;
    professionalIdFrom: string;
    professionalIdTo: string;
    observation: string;
  }): Promise<string> {
    const { patientId, professionalIdFrom, professionalIdTo, observation } =
      payload;

    const patient = await this.patientsRepository.findById(patientId);

    const professionalFrom = await this.professionalsRepository.findById(
      professionalIdFrom,
    );

    const professionalTo = await this.professionalsRepository.findById(
      professionalIdTo,
    );

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    if (!professionalFrom) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }
    if (!professionalTo) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }
    const patientStringfied = JSON.stringify(patient);

    mailer({
      to: professionalTo.email,
      subject: `📢Nova Solicitação de Encaminhamento de ${professionalFrom.name}`,
      body: `
      <h2>Olá, ${professionalFrom.sex === 'F' ? 'a Dra.' : 'o Dr.'} ${
        professionalFrom.name
      }</h2>
      <h4>sugeriu que você marque um atendimento com o paciente:</h4>
      <p>Nome: <b>${patient.name}</b></p>
      <p>Email: <b>${patient.email}</b></p>
      <p><b>Observações</b>: ${observation} </p>
      <hr/>
      <p>Clique no link abaixo para agendar no portal:</p>
      <a href=${`https://hausey.com.br/doctor/patientsDetails?patient=${patientStringfied}`} target="_blank">Agendar atendimento<a/>

    `,
    });

    return 'Mensagem Enviada';
  }
}
