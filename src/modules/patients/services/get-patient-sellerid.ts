import { injectable, inject } from 'tsyringe';
import { Patient } from '../entities/patient';
import { IPatientsRepository } from '../contracts/repositories/patients';

@injectable()
export class GetPatientSellerId {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async findBySellerId(sellerId: string): Promise<Patient[]> {
    return this.patientsRepository.findBySellerId(sellerId);
  }
}
