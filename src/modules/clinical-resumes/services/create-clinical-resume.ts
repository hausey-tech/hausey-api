import { injectable, inject } from 'tsyringe';
import { IClinicalResumesRepository } from '../contracts/repositories/clinical-resumes';
import { ClinicalResume } from '../entities/clinical-resume';
import { ICreateClinicalResumeDto } from '../contracts/dtos/create-clinical-resume';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { AppError } from '../../../shared/errors/app-error';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';

@injectable()
export class CreateClinicalResume {
  constructor(
    @inject('ClinicalResumeRepository')
    private clinicalResumesRepository: IClinicalResumesRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute({
    categoryId,
    clinicalResume,
    patientId,
    professionalId,
    terapeuticPlan,
  }: ICreateClinicalResumeDto): Promise<ClinicalResume> {
    const patientExists = await this.patientsRepository.findById(patientId);

    if (!patientExists) {
      throw new AppError(
        'Paciente não encontrado, verifique o id e tente novamente!',
      );
    }
    const professionalExists = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professionalExists) {
      throw new AppError(
        'Profissional não encontrado, verifique o id e tente novamente!',
      );
    }
    // const planExists = await this.groupTypesRepository.f(name);

    // if (planExists) {
    //   throw new AppError('Já existe um plano com esse nome!');
    // }

    const groupType = await this.clinicalResumesRepository.create({
      categoryId,
      clinicalResume,
      patientId,
      professionalId,
      terapeuticPlan,
    });

    return this.clinicalResumesRepository.save(groupType);
  }
}
