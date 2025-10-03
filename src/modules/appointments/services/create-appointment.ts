import { injectable, inject, container } from 'tsyringe';

import { Logger } from 'pino';
import moment from 'moment-timezone';
import { AlertProfessionalService } from '../../alert-professional/services/alertProfessional.service';
import { Professional } from '../../professionals/entities/professional';
import { ISlotsRepository } from '../../slots/contracts/repositories/slots';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { ICreateAppointmentDTO } from '../contracts/dtos/create-appointment';
import { AppError } from '../../../shared/errors/app-error';
import { Appointment } from '../entities/appointment';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';

import { createVideoRoomCode } from '../utils/create-video-room-code';
import { brevo } from '../../../shared/utils/brevo';
// import { mailer } from '../../../shared/utils/mailer';

@injectable()
export class CreateAppointmentService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute({
    patientId,
    professionalId,
    date,
    emergency,
  }: Omit<ICreateAppointmentDTO, 'roomId'>): Promise<Appointment> {
    try {
      const patient = await this.patientsRepository.findById(patientId);
      let professional: Professional | null;
      const hasAppointmentIsRunningByPatientId =
        await this.appointmentsRepository.findByPatientAndIsRunning(patientId);

      if (!patient) {
        throw new AppError(
          'Paciente não encontrado, verifique e tente novamente!',
        );
      }

      if (hasAppointmentIsRunningByPatientId) {
        throw new AppError(
          'Já existe um atendimento para este paciente em andamento. Finalize-o e tente novamente.',
        );
      }
      if (professionalId) {
        professional = await this.professionalsRepository.findById(
          professionalId,
        );

        if (!professional) {
          throw new AppError(
            'Profissional não encontrado, verifique e tente novamente!',
          );
        }
      }
      let roomId = '';

      if (professional) {
        const tratedDate = moment
          .tz(date, 'YYYY-MM-DD HH:mm:ss', professional.professionalTimezone)
          .utc()
          .toISOString();
        const appointmentByProfessionalIdAndDate =
          await this.appointmentsRepository.findAppointmentByProfessionalIdAndDate(
            professionalId,
            tratedDate,
          );

        const verifyIsAwaiting = appointmentByProfessionalIdAndDate.find(
          appointment => appointment.status === 'awaiting',
        );

        if (appointmentByProfessionalIdAndDate.length > 0 && verifyIsAwaiting) {
          throw new AppError(
            'Já existe uma consulta agendada neste dia e horário para este profissional.',
            400,
          );
        }
      }

      const room = await createVideoRoomCode();

      if (room) {
        roomId = room.roomId;
      }

      let appointment: Appointment;
      if (professionalId && emergency === false) {
        const convertDate = moment
          .tz(date, 'YYYY-MM-DD HH:mm:ss', professional.professionalTimezone)
          .utc()
          .toISOString();
        const hasAppointmentByPatientId =
          await this.appointmentsRepository.findByPatientIdAndDate(
            patientId,
            convertDate,
          );

        if (hasAppointmentByPatientId) {
          throw new AppError(
            'Já existe um atendimento para este paciente na hora e data referida.',
          );
        }

        const appointmentProfessional =
          await this.appointmentsRepository.create({
            patientId,
            professionalId,
            roomId,
            date: convertDate,
          });
        appointment = appointmentProfessional;
      }
      this.logger.info(
        {
          appointment,
        },
        'Appoinment Criado',
      );
      if (emergency) {
        const alertProfessional = container.resolve(AlertProfessionalService);
        await alertProfessional.execute();

        const appointmentEmergency = await this.appointmentsRepository.create({
          patientId,
          roomId,
          emergency,
          date,
        });
        appointment = appointmentEmergency;

        const slots = await this.slotsRepository.findByTodayDate(
          new Date(date),
        );
        const professionalIds = slots.map(slot => slot.professionalId);
        const professionalSlots = await this.professionalsRepository.findByIds(
          professionalIds,
        );

        if (professionalSlots.length > 0) {
          this.logger.info(
            {
              professionals: professionalSlots,
            },
            'Log de professionals',
          );

          brevo({
            to: 'hauseydevs@gmail.com',
            subject: `📢Nova Solicitação de Plantão!`,
            body: `
            <h2>Olá, um paciente solicitou um atendimento de plantão no app!</h2>
            <h4>Veja as informações:</h4>
            <p>Nome: <b>${patient.name}</b></p>
            <p>Email: <b>${patient.email}</b></p>
            <p>Telefone: <b>${patient.phoneNumber}</b></p>
            <p>
              Médicos do plantão:
              <ul>
                ${professionalSlots
                  .map(
                    professionals => `
                      <li>
                        Nome: <b>${professionals.name}</b><br>
                        Telefone: <b>${professionals.phoneNumber}</b>
                      </li>
                    `,
                  )
                  .join('')}
              </ul>
            </p>
            <hr/>
            <p>Clique no link abaixo para agendar no portal:</p>
            <a href="https://hausey.com.br/doctor/dashboard" target="_blank">Acessar atendimento</a>
          `,
          });

          professionalSlots.forEach((professionalSlot, index) => {
            setTimeout(() => {
              brevo({
                to: professionalSlot.email,
                subject: `📢Nova Solicitação de Plantão!`,
                body: `
                <h2>Olá, um paciente solicitou um atendimento de plantão no app!</h2>
                <h4>Veja as informações:</h4>
                <p>Nome: <b>${patient.name}</b></p>
                <p>Email: <b>${patient.email}</b></p>
                <p>Telefone: <b>${patient.phoneNumber}</b></p>
                <hr/>
                <p>Clique no link abaixo para agendar no portal:</p>
                <a href="https://hausey.com.br/doctor/dashboard" target="_blank">Acessar atendimento</a>
              `,
              });
            }, index * 2000);
          });
        }
      }

      appointment.paid = true;

      const newAppointment = await this.appointmentsRepository.save(
        appointment,
      );

      this.logger.info(
        {
          old: appointment,
          new: newAppointment,
        },
        'Appointment Save',
      );

      return appointment;
    } catch (error) {
      console.log('error', error);
      this.logger.info(
        {
          error,
        },
        'Houve um erro na criação do appointments',
      );
      throw new AppError(error);
    }
  }
}
