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
            country_code: phoneNumber.slice(1, 3),
            area_code: phoneNumber.slice(3, 5),
            number: phoneNumber.slice(5),
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
