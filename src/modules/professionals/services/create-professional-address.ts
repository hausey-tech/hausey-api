import { injectable, inject, container } from 'tsyringe';

import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { CreateAddressService } from '../../addresses/services/create-address';
import { ICreateAddressDTO } from '../../addresses/contracts/dtos/create-address';
import { AppError } from '../../../shared/errors/app-error';
import { Address } from '../../addresses/entities/address';

interface IPayload extends ICreateAddressDTO {
  professionalId: string;
}

@injectable()
export class CreateProfessionalAddressService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(payload: IPayload): Promise<Address> {
    const { professionalId, ...data } = payload;

    const profissional = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!profissional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    if (profissional.addressId) {
      throw new AppError(
        'Esse profissional já possui um endereço cadastrado, edite-o',
      );
    }

    const createAddressService = container.resolve(CreateAddressService);

    const address = await createAddressService.execute(data);

    profissional.addressId = address.id;

    await this.professionalsRepository.save(profissional);

    return address;
  }
}
