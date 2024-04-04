import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { pagarmeInstance } from '../../utils/pagarme-instance';

interface IProps {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  bankAccount: {
    holderName: string;
    bank: string;
    branchNumber: string;
    branchCheckDigit?: string;
    accountNumber: string;
    accountCheckDigit: string;
    holderType: 'individual' | 'company';
    holderDocument: string;
    type: 'checking' | 'savings';
  };
}

@injectable()
export class CreatePagarmeRecipientService {
  public async execute({
    id,
    email,
    name,
    phoneNumber,
    bankAccount,
  }: IProps): Promise<string> {
    try {
      const { data } = await pagarmeInstance.post('/recipients', {
        code: id,
        email,
        name,
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code: phoneNumber.slice(0, 2),
            number: phoneNumber.slice(2),
          },
        },
        document: bankAccount.holderDocument,
        type: bankAccount.holderType,
        default_bank_account: {
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
      return data.id;
    } catch (error) {
      throw new AppError(
        `Erro ao criar recipient: ${error.response.data.message as string}`,
      );
    }
  }
}
