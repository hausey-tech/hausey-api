import { Repository } from 'typeorm';

import { IAddressesRepository } from '../contracts/repositories/addresses';
import { ICreateAddressDTO } from '../contracts/dtos/create-address';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Address } from '../entities/address';

export class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Address);
  }

  public async create(address: ICreateAddressDTO): Promise<Address> {
    return this.ormRepository.create(address);
  }

  public async save(address: Address): Promise<Address> {
    return this.ormRepository.save(address);
  }

  public async findById(id: string): Promise<Address> {
    return this.ormRepository.findOne({ where: { id } });
  }
}
