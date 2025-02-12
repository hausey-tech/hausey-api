import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { stripeInstance, stripePTInstance } from '../../utils/stripe-instance';

interface IProps {
  id: string;
  email: string;
  region: string;
}

@injectable()
export class CreateConnectAccountService {
  public async execute({ id, email, region }: IProps): Promise<string> {
    try {
      if (region !== 'pt') {
        const data = await stripeInstance.accounts.create({
          email,
          type: 'express',
          metadata: {
            userId: id,
          },
        });
        return data.id;
      }
      const data = await stripePTInstance.accounts.create({
        email,
        type: 'express',
        metadata: {
          userId: id,
        },
      });
      return data.id;
    } catch (error) {
      throw new AppError(`Erro ao criar conta conectada: ${error}`);
    }
  }
}
