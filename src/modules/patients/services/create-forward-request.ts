import { injectable, inject, container } from 'tsyringe';
import { format, subHours } from 'date-fns';
import { CreateAppointmentService } from '../../appointments/services/create-appointment';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { brevo } from '../../../shared/utils/brevo';

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
    shouldCreateAppointment: boolean;
  }): Promise<string> {
    const {
      patientId,
      professionalIdFrom,
      professionalIdTo,
      observation,
      shouldCreateAppointment,
    } = payload;

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

    if (shouldCreateAppointment) {
      const now = new Date();
      const formattedDate = format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm");

      const payloadAppointment = {
        patientId,
        professionalId: professionalIdTo,
        date: formattedDate,
      };

      const createAppointmentService = container.resolve(
        CreateAppointmentService,
      );
      await createAppointmentService.execute(payloadAppointment);
    }

    const patientStringfied = JSON.stringify(patient);

    brevo({
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
