import { injectable, inject } from 'tsyringe';

import { IAddressesRepository } from '../contracts/repositories/IAddressesRepository';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { ICreateAddressDTO } from '../contracts/dtos/ICreateAddressDTO';
import { AppError } from '../../../shared/errors/app-error';
import { Address } from '../entities/Address';

@injectable()
export class CreateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(payload: ICreateAddressDTO): Promise<Address> {
    const { patientId } = payload;

    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    const patientAddress = await this.addressesRepository.findByPatientId(
      patient.id,
    );

    if (patientAddress) {
      await this.addressesRepository.delete(patientAddress.id);
    }

    const address = await this.addressesRepository.create(payload);

    return this.addressesRepository.save(address);
  }
}
