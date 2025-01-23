import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { Patient } from '../entities/patient';
import { IPatientsRepository } from '../contracts/repositories/patients';

interface PatientsPaginatedResponse {
  patients: Array<Patient>;
  totalPatients: number;
  totalPages: number;
}

@injectable()
export class GetPatientSellerId {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async findBySellerId(
    sellerId: string,
    page?: string,
    limit?: string,
  ): Promise<PatientsPaginatedResponse | Patient | Patient[]> {
    if (Number.isNaN(page) || Number(page) < 1) {
      throw new AppError('Page must be a valid number');
    }

    if (Number.isNaN(limit) || Number(limit) < 1) {
      throw new AppError('Invalid limit value');
    }

    const patients = await this.patientsRepository.findBySellerId(sellerId);

    return patients;
  }
}
