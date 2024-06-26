import { injectable } from 'tsyringe';
import { pagarmeInstance } from '../../integrations/utils/pagarme-instance';
import { AppError } from '../../../shared/errors/app-error';
import { IUpdateBankAccount } from '../contracts/dtos/update-bank-account-dto';

@injectable()
export class UpdateBankAccountService {
  public async execute({
    recipientId,
    bankAccount,
  }: IUpdateBankAccount): Promise<void> {
    try {
      await pagarmeInstance.patch(
        `/recipients/${recipientId}/default-bank-account`,
        {
          bank_account: {
            holder_name: bankAccount.holderName,
            bank: bankAccount.bank,
            branch_number: bankAccount.branchNumber,
            branch_check_digit: bankAccount.branchCheckDigit,
            account_number: bankAccount.accountNumber,
            account_check_digit: bankAccount.accountCheckDigit,
            holder_type: bankAccount.holderType,
            holder_document: bankAccount.holderDocument,
            type: bankAccount.type,
          },
        },
      );
    } catch (error) {
      console.log('Erro editar conta bancária:', error.response.data);
      throw new AppError('Erro ao editar conta bancária');
    }
  }
}
