import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { pagarmeInstance } from '../../utils/pagarme-instance';

interface IProps {
  id: string;
  email: string;
  name: string;
  document: string;
  phoneNumber: string;
}

@injectable()
export class CreatePagarmeCustomerService {
  public async execute({
    id,
    email,
    name,
    document,
    phoneNumber,
  }: IProps): Promise<string> {
    try {
      const { data } = await pagarmeInstance.post('/customers', {
        code: id,
        email,
        name,
        document,
        type: 'individual',
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code: phoneNumber.slice(0, 2),
            number: phoneNumber.slice(2),
          },
        },
      });
      return data.id;
    } catch (error) {
      throw new AppError(
        `Erro ao criar customer: ${error.response.data.message as string}`,
      );
    }
  }
}
