import Stripe from 'stripe';
import { container, inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { IPlansRepository } from '../../../plans/contracts/repositories/plans';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { stripeInstance, stripePTInstance } from '../../utils/stripe-instance';
import { CreateCustomer } from './create-customer';
import { CreatePaymentMethod } from './create-payment-method';
import { Patient } from '../../../patients/entities/patient';

interface Card {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

interface Props {
  patientId: string;
  priceId: string;
  card: Card | string;
  country: string;
}

@injectable()
export class CreateSubscription {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({
    patientId,
    priceId,
    card,
    country,
  }: Props): Promise<Patient> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    const plan = await this.plansRepository.findyByPriceId(priceId);

    if (!plan) {
      throw new AppError('Plano não encontrado, verifique e tente novamente!');
    }

    let customerId = patient.stripeCustomerId;
    let subscription: Stripe.Response<Stripe.Subscription>;

    try {
      if (!customerId) {
        const createCustomer = container.resolve(CreateCustomer);
        const customer = await createCustomer.execute({
          email: patient.email,
          name: patient.name,
          country,
        });
        customerId = customer.id;
      }

      let cardId: string;

      if (typeof card !== 'string') {
        const createPaymentMethod = container.resolve(CreatePaymentMethod);
        const paymentMethod = await createPaymentMethod.execute({
          customerId,
          card,
          country,
        });

        cardId = paymentMethod.id;
      } else {
        cardId = card;
      }
      if (country !== 'pt') {
        subscription = await stripeInstance.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          collection_method: 'charge_automatically',
          payment_behavior: 'error_if_incomplete',
          default_payment_method: cardId,
        });
      }
      subscription = await stripePTInstance.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        collection_method: 'charge_automatically',
        payment_behavior: 'error_if_incomplete',
        default_payment_method: cardId,
      });
    } catch (err) {
      throw new AppError(err.raw.message, err.statusCode);
    }

    patient.planId = plan.id;
    patient.stripeCustomerId = customerId;
    patient.planExpiresAt = new Date(subscription.current_period_end * 1000);

    return this.patientsRepository.save(patient);
  }
}
