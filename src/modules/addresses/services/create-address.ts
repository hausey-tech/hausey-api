import { injectable, inject } from 'tsyringe';

import { IAddressesRepository } from '../contracts/repositories/addresses';
import { ICreateAddressDTO } from '../contracts/dtos/create-address';
import { Address } from '../entities/address';

@injectable()
export class CreateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute(payload: ICreateAddressDTO): Promise<Address> {
    const address = await this.addressesRepository.create(payload);

    return this.addressesRepository.save(address);
  }
}
