import { injectable, inject, container } from 'tsyringe';

import { ISlotsRepository } from '../../slots/contracts/repositories/slots';
import { AlertProfessionalService } from '../../alert-professional/services/alertProfessional.service';
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

    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,
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
    if (professionalId && emergency === false) {
      const appointmentProfessional = await this.appointmentsRepository.create({
        patientId,
        professionalId,
        roomId,
        date,
      });
      appointment = appointmentProfessional;
    }
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

      // Logica para enviar email para os profissionais conforme cadastrados na escala de slots

      // const dateAppoint = String(appointment.date).split('T')[0]; // Formata para 'YYYY-MM-DD'
      // const appointmentTime = appointment.date.toTimeString().split(' ')[0]; // Formata para 'HH:mm:ss'

      // Filtrar os slots válidos com base na hora
      // const slots = await this.slotsRepository.findValidSlots({
      //   date: dateAppoint,
      //   appointmentTime,
      // });
      // const professionalIds = slots.map(slot => slot.professionalId);
      // const professionalSlots = await this.professionalsRepository.findByIds(
      //   professionalIds,
      // );

      const slots = await this.slotsRepository.findByTodayDate(new Date(date));
      const professionalIds = slots.map(slot => slot.professionalId);
      const professionalSlots = await this.professionalsRepository.findByIds(
        professionalIds,
      );

      // etapa de envio de email. Deletar professionals abaixo apos consluida a logica de filtro.

      // const professionals = await this.professionalsRepository.findByRoleIds([
      //   'b3460425-43fd-45ea-aec1-339627ea9825',
      //   '64db0cda-ee21-4a82-a765-b0500d0bbd52',
      // ]);
      if (professionalSlots.length > 0) {
        professionalSlots.map(professional =>
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
