import { injectable, inject } from 'tsyringe';

import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';

@injectable()
export class ListPatientsService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(): Promise<Patient[]> {
    return this.patientsRepository.find();
  }
}
