import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { PatientDependent } from '../entities/patient-dependent';

interface IResult {
  holder: PatientDependent['holder'];
  siblings: PatientDependent[];
}

@injectable()
export class GetHolderByDependentService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,
  ) {}

  public async execute(dependentPatientId: string): Promise<IResult> {
    const link = await this.dependentsRepository.findByDependentPatientId(
      dependentPatientId,
    );

    if (!link) {
      throw new AppError(
        'Dependente não encontrado ou não vinculado a nenhum titular.',
      );
    }

    const siblings = await this.dependentsRepository.findByHolderId(
      link.holderId,
    );

    return {
      holder: link.holder,
      siblings,
    };
  }
}
