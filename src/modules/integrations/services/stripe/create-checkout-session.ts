import Stripe from 'stripe';
import { container, inject, injectable } from 'tsyringe';
import { Logger } from 'pino';
import { AppError } from '../../../../shared/errors/app-error';
import { IPlansRepository } from '../../../plans/contracts/repositories/plans';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { ISellerCodesRepository } from '../../../seller-codes/contracts/repositories/seller-codes';
import { stripeInstance, stripePTInstance } from '../../utils/stripe-instance';
import { CreateCustomer } from './create-customer';

interface Props {
  patientId: string;
  priceId: string;
  coupon?: string;
}

@injectable()
export class CreateCheckoutSession {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  // TODO - Adicionar o country na tabela de paciente e alterar o valor neste método.
  public async execute({
    patientId,
    priceId,
  }: Props): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      this.logger.info(
        {
          error: 'Paciente não encontrado, verifique e tente novamente',
        },
        'Erro dentro do if patient',
      );
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    const plan = await this.plansRepository.findyByPriceId(priceId);

    if (!plan) {
      this.logger.info(
        {
          error: 'Plano não encontrado, verifique e tente novamente!',
        },
        'Erro dentro da condicional plan.',
      );
      throw new AppError('Plano não encontrado, verifique e tente novamente!');
    }

    let customerId = patient.stripeCustomerId;
    let sessionParams: Stripe.Checkout.SessionCreateParams;
    let session: Stripe.Response<Stripe.Checkout.Session>;
    let promoCodeId: string;

    if (patient.sellerId) {
      const sellerCode = await this.sellerCodesRepository.findBySellerId(
        patient.sellerId,
      );
      const sellerCodeDiscount = sellerCode.discounts.find(
        d => d.planId === plan.id,
      );
      if (sellerCodeDiscount && sellerCodeDiscount.stripePromoCodeId) {
        promoCodeId = sellerCodeDiscount.stripePromoCodeId;
      }
    }

    try {
      if (!customerId) {
        const createCustomer = container.resolve(CreateCustomer);
        const customer = await createCustomer.execute({
          email: patient.email,
          name: patient.name,
          country: patient.region,
        });
        customerId = customer.id;
      }

      if (patient.region === 'pt') {
        sessionParams = {
          customer: customerId,
          success_url: 'https://hausey.com.br/app',
          line_items: [{ price: priceId, quantity: 1 }],
          mode: 'subscription',
          cancel_url: 'https://hausey.com.br/app',
          discounts: [{ promotion_code: promoCodeId }],
        };
        session = await stripePTInstance.checkout.sessions.create(
          sessionParams,
        );
      }
      sessionParams = {
        customer: customerId,
        success_url: 'https://hausey.com.br/app',
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        cancel_url: 'https://hausey.com.br/app',
        discounts: [{ promotion_code: promoCodeId }],
      };
      this.logger.info(
        {
          message: sessionParams,
        },
        'Dados enviado para a criação do checkout',
      );
      session = await stripeInstance.checkout.sessions.create(sessionParams);
    } catch (err) {
      this.logger.info(
        {
          error: err,
        },
        'Catch create checkout session',
      );
      throw new AppError(err.raw.message, err.statusCode);
    }
    patient.planId = plan.id;
    patient.stripeCustomerId = customerId;

    await this.patientsRepository.save(patient);

    return session;
  }
}
