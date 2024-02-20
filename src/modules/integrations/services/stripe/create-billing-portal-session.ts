import Stripe from 'stripe';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { stripeInstance } from '../../utils/stripe-instance';

interface Props {
  patientId: string;
}

@injectable()
export class CreateBillingPortalSession {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({
    patientId,
  }: Props): Promise<Stripe.Response<Stripe.BillingPortal.Session>> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    if (!patient.stripeCustomerId) {
      throw new AppError(
        'Ocorreu um erro ao recuperar a conta de pagamento, entre em contato com o suporte!',
      );
    }

    let session: Stripe.Response<Stripe.BillingPortal.Session>;
    try {
      session = await stripeInstance.billingPortal.sessions.create({
        customer: patient.stripeCustomerId,
      });
    } catch (err) {
      throw new AppError(err.raw.message, err.statusCode);
    }

    return session;
  }
}
