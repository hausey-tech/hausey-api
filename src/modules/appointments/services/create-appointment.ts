import { injectable, inject, container } from 'tsyringe';

import { ICreateAppointmentDTO } from '../contracts/dtos/create-appointment';
import { AppError } from '../../../shared/errors/app-error';
import { Appointment } from '../entities/appointment';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { CheckAppointmentPrice } from './check-appointment-price';
import { CreatePaymentMethod } from '../../integrations/services/stripe/create-payment-method';
import { CreatePaymentIntent } from '../../integrations/services/stripe/create-payment-intent';
import { CreateCustomer } from '../../integrations/services/stripe/create-customer';

interface Card {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

interface Props extends ICreateAppointmentDTO {
  card: Card | string;
}

@injectable()
export class CreateAppointmentService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    patientId,
    specialtyId,
    date,
    card,
  }: Props): Promise<Appointment> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
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
      specialtyId,
      date,
    });

    appointment.paid = true;

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}
