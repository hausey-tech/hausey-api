import { injectable, inject } from 'tsyringe';
import { isBefore } from 'date-fns';

import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';

@injectable()
export class UpdatePatientIsProService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(patient: Patient): Promise<Patient> {
    if (!patient?.planExpiresAt) {
      return patient;
    }

    const expiresAt = new Date(patient.planExpiresAt);
    const isActive = isBefore(new Date(), expiresAt);
    const shouldBePro = isActive;

    if (patient.isPro === shouldBePro) {
      return patient;
    }

    return this.patientsRepository.update(patient.id, { isPro: shouldBePro });
  }
}
