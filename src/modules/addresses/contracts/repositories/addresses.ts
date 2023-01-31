import { Address } from '../../entities/address';
import { ICreateAddressDTO } from '../dtos/create-address';

export interface IAddressesRepository {
  create(address: ICreateAddressDTO): Promise<Address>;
  save(address: Address): Promise<Address>;
  findById(id: string): Promise<Address>;
}
