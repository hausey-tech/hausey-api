import { injectable } from 'tsyringe';
import { pagarmeInstance } from 'modules/integrations/utils/pagarme-instance';
import { AppError } from '../../../shared/errors/app-error';
import { ICreateBankAccount } from '../contracts/dtos/create-bank-account-dto';

@injectable()
export class UpdateBankAccountService {
  public async execute({ id, bankAccount }: ICreateBankAccount): Promise<void> {
    try {
      await pagarmeInstance.patch(`/recipients/${id}/default-bank-account`, {
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
      });
    } catch (error) {
      throw new AppError(
        'Erro ao editar conta bancária: ',
        error.response.data.message,
      );
    }
  }
}
