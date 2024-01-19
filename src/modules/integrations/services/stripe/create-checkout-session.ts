import Stripe from 'stripe';
import { container, inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { IPlansRepository } from '../../../plans/contracts/repositories/plans';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { stripeInstance } from '../../utils/stripe-instance';
import { CreateCustomer } from './create-customer';

interface Props {
  patientId: string;
  priceId: string;
}

@injectable()
export class CreateCheckoutSession {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({
    patientId,
    priceId,
  }: Props): Promise<Stripe.Response<Stripe.Checkout.Session>> {
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
    let session: Stripe.Response<Stripe.Checkout.Session>;

    try {
      if (!customerId) {
        const createCustomer = container.resolve(CreateCustomer);
        const customer = await createCustomer.execute({
          email: patient.email,
          name: patient.name,
        });
        customerId = customer.id;
      }

      session = await stripeInstance.checkout.sessions.create({
        customer: customerId,
        success_url: 'https://frete.meuceasa.com.br',
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        cancel_url: 'https://frete.meuceasa.com.br',
      });
    } catch (err) {
      throw new AppError(err.raw.message, err.statusCode);
    }
    patient.planId = plan.id;
    patient.stripeCustomerId = customerId;

    await this.patientsRepository.save(patient);

    return session;
  }
}
