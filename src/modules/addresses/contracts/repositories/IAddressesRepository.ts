import { Address } from '../../entities/Address';
import { ICreateAddressDTO } from '../dtos/ICreateAddressDTO';

export interface IAddressesRepository {
  findById(id: string): Promise<Address>;
  findByPatientId(patientId: string): Promise<Address>;
  create(address: ICreateAddressDTO): Promise<Address>;
  save(address: Address): Promise<Address>;
}
