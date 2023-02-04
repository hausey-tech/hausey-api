import { Address } from '../../entities/Address';
import { ICreateAddressDTO } from '../dtos/ICreateAddressDTO';

export interface IAddressesRepository {
  create(address: ICreateAddressDTO): Promise<Address>;
  save(address: Address): Promise<Address>;
  findById(id: string): Promise<Address>;
}
