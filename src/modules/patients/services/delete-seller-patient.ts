import { injectable, inject } from 'tsyringe';

import { Logger } from 'pino';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IUpdatePatientDTO } from '../contracts/dtos/update-patient';

@injectable()
export class DeleteSellerByPatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(patientId: string): Promise<any> {
    try {
      const patient = await this.patientsRepository.findById(patientId);

      if (!patient) {
        throw new AppError('Paciente com este id não encontrado');
      }

      const patientToUpdate: IUpdatePatientDTO = {
        ...patient,
        planExpiresAt: patient.birthdate
          ? new Date(patient.birthdate)
              .toISOString()
              .replace('T', ' ')
              .split('.')[0]
          : null,
        planId: null,
      };

      await this.patientsRepository.update(patient.id, patientToUpdate);
    } catch (error) {
      this.logger.info(
        {
          error,
        },
        'Houve um erro ao deletar cupom',
      );
      throw new AppError('Erro ao deletar cupom do usuário');
    }
  }
}
