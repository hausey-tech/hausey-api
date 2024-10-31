import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { stripeInstance } from '../../utils/stripe-instance';

interface IProps {
  id: string;
  email: string;
  bankAccount: {
    accountNumber: string;
    country: string;
    currency: string;
    routingNumber: string;
  };
}

@injectable()
export class CreateConnectAccountService {
  public async execute({ id, email, bankAccount }: IProps): Promise<string> {
    try {
      const data = await stripeInstance.accounts.create({
        country: bankAccount.country,
        email,
        metadata: {
          userId: id,
        },
        type: 'express',
        external_account: {
          account_number: bankAccount.accountNumber,
          country: bankAccount.country,
          currency: bankAccount.currency,
          routing_number: bankAccount.accountNumber,
          object: 'bank_account',
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
