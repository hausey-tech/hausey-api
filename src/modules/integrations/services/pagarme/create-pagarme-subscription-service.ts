import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { pagarmeInstance } from '../../utils/pagarme-instance';

interface IProps {
  planId: string;
  paymentMethod: string;
  customerId: string;
  cardToken: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
  };
  split?: {
    amount: number;
    recipientId: string;
    type: string;
    options: {
      chargeProcessingFee: boolean;
      chargeRemainderFee: boolean;
      liable: boolean;
    };
  }[];
  discounts?: {
    cycles: string;
    value: string;
    discountType: string;
  }[];
}

interface IResponse {
  id: string;
  code: string;
  start_at: string;
  interval: string;
  interval_count: number;
  billing_type: string;
  current_cycle: {
    id: string;
    start_at: string;
    end_at: string;
    billing_at: string;
  };
  next_billing_at: string;
  payment_method: string;
  currency: string;
  statement_descriptor: string;
  installments: number;
  status: string;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    name: string;
    email: string;
    delinquent: boolean;
    created_at: string;
    updated_at: string;
    phones: object;
  };
  plan: {
    id: string;
    name: string;
    description: string;
    url: string;
    statement_descriptor: string;
    interval: string;
    interval_count: number;
    billing_type: string;
    payment_methods: string[];
    installments: number[];
    status: string;
    currency: string;
    created_at: string;
    updated_at: string;
  };
  items: {
    id: string;
    name: string;
    description: string;
    quantity: number;
    status: string;
    created_at: string;
    updated_at: string;
    pricing_scheme: {
      price: number;
      scheme_type: string;
    };
  }[];
}

@injectable()
export class CreatePagarmeSubscriptionService {
  public async execute({
    planId,
    paymentMethod,
    customerId,
    cardToken,
    address,
    split,
    discounts,
  }: IProps): Promise<string> {
    try {
      const { data }: { data: IResponse } = await pagarmeInstance.post(
        '/subscriptions',
        {
          plan_id: planId,
          payment_method: paymentMethod,
          customer_id: customerId,
          card_token: cardToken,
          card: {
            billing_address: {
              line_1: `${address.number}, ${address.street}, ${address.neighborhood}`,
              line_2: address.complement,
              zip_code: address.zipCode,
              city: address.city,
              state: address.state,
              country: address.country,
            },
          },
          split:
            split?.length > 0
              ? {
                  enabled: true,
                  rules: split.map(sp => ({
                    amount: sp.amount,
                    recipient_id: sp.recipientId,
                    type: sp.type,
                    options: {
                      charge_processing_fee: sp.options.chargeProcessingFee,
                      charge_remainder_fee: sp.options.chargeRemainderFee,
                      liable: sp.options.liable,
                    },
                  })),
                }
              : undefined,
          discounts:
            discounts?.length > 0
              ? discounts?.map(discount => ({
                  cycles: discount.cycles,
                  value: discount.value,
                  discount_type: discount.discountType,
                }))
              : undefined,
        },
      );
      return data.current_cycle.end_at;
    } catch (error) {
      throw new AppError(
        `Erro ao criar assinatura: ${error.response.data.message as string}`,
      );
    }
  }
}
