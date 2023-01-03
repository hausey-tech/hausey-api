import { PrimaryDiagnosis } from '../../entities/primary-diagnosis';
import { ICreatePrimaryDiagnosisDTO } from '../dtos/create-primary-diagnosis';

export interface IPrimaryDiagnosesRepository {
  create(
    primaryDiagnosis: ICreatePrimaryDiagnosisDTO,
  ): Promise<PrimaryDiagnosis>;
  save(primaryDiagnosis: PrimaryDiagnosis): Promise<PrimaryDiagnosis>;
  update(id: string, description: string): Promise<PrimaryDiagnosis>;
  findById(id: string): Promise<PrimaryDiagnosis>;
}
