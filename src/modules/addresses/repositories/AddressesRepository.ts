import { Repository } from 'typeorm';

import { IAddressesRepository } from '../contracts/repositories/IAddressesRepository';
import { ICreateAddressDTO } from '../contracts/dtos/ICreateAddressDTO';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Address } from '../entities/Address';

export class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Address);
  }

  public async findById(id: string): Promise<Address> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByPatientId(patientId: string): Promise<Address> {
    return this.ormRepository.findOne({ where: { patientId } });
  }

  public async create(address: ICreateAddressDTO): Promise<Address> {
    return this.ormRepository.create(address);
  }

  public async save(address: Address): Promise<Address> {
    return this.ormRepository.save(address);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
