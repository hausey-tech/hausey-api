import { injectable, inject } from 'tsyringe';

import { ICreatePatientDTO } from '../contracts/dtos/create-patient';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';

@injectable()
export class CreatePatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(payload: ICreatePatientDTO): Promise<Patient> {
    const {
      email,
      password,
      name,
      document,
      birthdate,
      phoneNumber,
      sex,
      planId,
    } = payload;

    const patient = await this.patientsRepository.create({
      email,
      password,
      name,
      document,
      birthdate,
      phoneNumber,
      sex,
      planId,
    });

    return this.patientsRepository.save(patient);
  }
}
