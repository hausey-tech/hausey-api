import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { stripeInstance } from '../../utils/stripe-instance';

interface IProps {
  id: string;
  email: string;
}

@injectable()
export class CreateConnectAccountService {
  public async execute({ id, email }: IProps): Promise<string> {
    try {
      const data = await stripeInstance.accounts.create({
        email,
        type: 'express',
        metadata: {
          userId: id,
        },
      });
      return data.id;
    } catch (error) {
      console.log('error: ', error);
      throw new AppError(
        `Erro ao criar conta conectada: ${
          error.response.data.message as string
        }`,
      );
    }
  }
}
