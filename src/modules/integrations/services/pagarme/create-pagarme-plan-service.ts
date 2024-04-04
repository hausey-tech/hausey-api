import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { pagarmeInstance } from '../../utils/pagarme-instance';

interface IProps {
  name: string;
  price: number;
  description: string;
}

@injectable()
export class CreatePagarmePlanService {
  public async execute({ name, description, price }: IProps): Promise<string> {
    try {
      const { data } = await pagarmeInstance.post('/plans', {
        name,
        description,
        quantity: 1,
        interval: 'month',
        payment_methods: ['credit_card', 'debit_card'],
        interval_count: 1,
        pricing_scheme: {
          scheme_type: 'unit',
          price,
        },
      });
      return data.id;
    } catch (error) {
      throw new AppError(
        `Erro ao criar plano: ${error.response.data.message as string}`,
      );
    }
  }
}
