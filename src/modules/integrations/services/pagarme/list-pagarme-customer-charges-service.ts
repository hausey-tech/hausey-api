import { injectable } from 'tsyringe';
import { IPagarmeChargeDTO } from '../../contracts/dtos/pagarme/pagarme-charge-dto';
import { AppError } from '../../../../shared/errors/app-error';
import { pagarmeInstance } from '../../utils/pagarme-instance';

interface IProps {
  customerId: string;
}

interface IResponse {
  data: IPagarmeChargeDTO[];
  paging: {
    total: number;
    next: string;
  };
}

@injectable()
export class ListPagarmeCustomerChargesService {
  public async execute({ customerId }: IProps): Promise<IResponse> {
    try {
      const { data } = await pagarmeInstance.get(
        `/charges?customer_id=${customerId}`,
      );
      return data;
    } catch (error) {
      throw new AppError(
        `Erro ao listar cobranças: ${error.response.data.message as string}`,
      );
    }
  }
}
