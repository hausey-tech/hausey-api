import { injectable, inject } from 'tsyringe';

import { IProfessionalsRepository } from 'modules/professionals/contracts/repositories/professionals';
import { ICreateAppointmentDTO } from '../contracts/dtos/create-appointment';
import { AppError } from '../../../shared/errors/app-error';
import { Appointment } from '../entities/appointment';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';

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
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }
    const professional = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
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

    const appointment = await this.appointmentsRepository.create({
      patientId,
      professionalId,
      date,
    });

    appointment.paid = true;

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}
