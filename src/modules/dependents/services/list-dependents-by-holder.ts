import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { IDependentByHolderDTO } from '../contracts/dtos/list-dependents-by-holder-dto';

@injectable()
export class ListDependentsByHolderService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,
  ) {}

  public async execute(holderId: string): Promise<IDependentByHolderDTO[]> {
    const holder = await this.patientsRepository.findById(holderId);

    if (!holder) {
      throw new AppError('Titular não encontrado.', 404);
    }

    const dependents = await this.dependentsRepository.findByHolderId(holderId);

    return dependents.map(dependent => ({
      id: dependent.id,
      holderId: dependent.holderId,
      dependentPatientId: dependent.dependentPatientId,
      dependentPatient: dependent.dependentPatient,
      hasAppAccess: dependent.hasAppAccess,
      name: dependent.name,
      birthdate: dependent.birthdate,
      cpf: dependent.cpf,
      email: dependent.email,
      status: dependent.status,
      createdAt: dependent.createdAt,
      updatedAt: dependent.updatedAt,
    }));
  }
}
