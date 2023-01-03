import { PrimaryDiagnosis } from '../../entities/primary-diagnosis';
import { ICreatePrimaryDiagnosisDTO } from '../dtos/create-primary-diagnosis';

export interface IPrimaryDiagnosesRepository {
  create(
    primaryDiagnosis: ICreatePrimaryDiagnosisDTO,
  ): Promise<PrimaryDiagnosis>;
  save(primaryDiagnosis: PrimaryDiagnosis): Promise<PrimaryDiagnosis>;
}
