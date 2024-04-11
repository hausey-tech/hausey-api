import { injectable, inject } from 'tsyringe';

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { ICreateAppointmentDTO } from '../contracts/dtos/create-appointment';
import { AppError } from '../../../shared/errors/app-error';
import { Appointment } from '../entities/appointment';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';

import { createVideoRoomCode } from '../utils/create-video-room-code';
import { sendgrid } from '../../../shared/utils/sendgrid';
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
  ) {}

  public async execute({
    patientId,
    professionalId,
    date,
    emergency,
  }: Omit<ICreateAppointmentDTO, 'roomId'>): Promise<Appointment> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }
    if (professionalId) {
      const professional = await this.professionalsRepository.findById(
        professionalId,
      );

      if (!professional) {
        throw new AppError(
          'Profissional não encontrado, verifique e tente novamente!',
        );
      }
    }
    let roomId = '';

    const room = await createVideoRoomCode();

    if (room) {
      roomId = room.roomId;
    }

    // let customerId: string;

    // if (!patient.stripeCustomerId) {
    //   const createCustomerService = container.resolve(CreateCustomer);
    //   const customer = await createCustomerService.execute({
    //     email: patient.email,
    //     name: patient.name,
    //   });
    //   customerId = customer.id;
    //   patient.stripeCustomerId = customer.id;
    //   await this.patientsRepository.save(patient);
    // } else {
    //   customerId = patient.stripeCustomerId;
    // }

    // const checkPrice = container.resolve(CheckAppointmentPrice);
    // const { totalInCents } = await checkPrice.execute(patientId, specialtyId);

    // let paymentMethodId: string;

    // if (typeof card !== 'string') {
    //   const createPaymentMethodService = container.resolve(CreatePaymentMethod);
    //   const paymentMethod = await createPaymentMethodService.execute({
    //     customerId,
    //     card,
    //   });
    //   paymentMethodId = paymentMethod.id;
    // } else {
    //   paymentMethodId = card;
    // }

    // const createPaymentIntentService = container.resolve(CreatePaymentIntent);
    // await createPaymentIntentService.execute({
    //   card: paymentMethodId,
    //   price: totalInCents,
    //   customerId,
    // });
    let appointment: Appointment;
    if (professionalId) {
      const appointmentProfessional = await this.appointmentsRepository.create({
        patientId,
        professionalId,
        roomId,
        date,
      });
      appointment = appointmentProfessional;
    }
    if (emergency) {
      const appointmentEmergency = await this.appointmentsRepository.create({
        patientId,
        roomId,
        emergency,
        date,
      });
      appointment = appointmentEmergency;
      const professionals = await this.professionalsRepository.findByRoleIds([
        'b3460425-43fd-45ea-aec1-339627ea9825',
        '64db0cda-ee21-4a82-a765-b0500d0bbd52',
      ]);
      if (professionals.length > 0) {
        professionals.map(professional =>
          setTimeout(
            () =>
              sendgrid({
                to: professional.email,
                subject: `📢Nova Solicitação de Plantão!`,
                text: 'veja as informações do plantão',
                body: `
            <h2>Olá, um paciente solicitou um atendimento de plantão no app!</h2>
            <h4>Veja as informações:</h4>
            <p>Nome: <b>${patient.name}</b></p>
            <p>Email: <b>${patient.email}</b></p>
            <p>Telefone: <b>${patient.phoneNumber}</b></p>
            <hr/>
            <p>Clique no link abaixo para agendar no portal:</p>
            <a href=${'https://hausey.com.br/doctor/dashboard'} target="_blank">Acessar atendimento<a/>
          `,
              }),
            2000,
          ),
        );
      }
    }

    appointment.paid = true;

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}
