import { injectable, inject, container } from 'tsyringe';

import { CreateAddressService } from '../../addresses/services/create-address';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { ICreateAddressDTO } from '../../addresses/contracts/dtos/create-address';
import { AppError } from '../../../shared/errors/app-error';
import { Address } from '../../addresses/entities/address';

@injectable()
export class CreatePatientAddressService {
  constructor(
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

    if (patient.addressId) {
      throw new AppError(
        'Esse paciente já possui um endereço cadastrado, edite-o',
      );
    }

    const createAddressService = container.resolve(CreateAddressService);

    const address = await createAddressService.execute(payload);

    patient.addressId = address.id;

    await this.patientsRepository.save(patient);

    return address;
  }
}
