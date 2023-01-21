import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { formatMoney } from '../../../shared/utils/format-money';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPatientProgramsRepository } from '../../patients/contracts/repositories/patient-programs';
import { ISpecialtiesRepository } from '../../professionals/contracts/repositories/specialties';
import { IPlanSpecialtyDiscountsRepository } from '../../plans/contracts/repositories/plan-specialty-discounts';
import { IProgramSpecialtyDiscountsRepository } from '../../programs/contracts/repositories/program-specialty-discounts';

interface IPrices {
  price: string;
  discount: string;
  total: string;
}

@injectable()
export class CheckAppointmentPrice {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PatientProgramsRepository')
    private patientProgramsRepository: IPatientProgramsRepository,

    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,

    @inject('PlanSpecialtyDiscountsRepository')
    private planSpecialtyDiscountsRepository: IPlanSpecialtyDiscountsRepository,

    @inject('ProgramSpecialtyDiscountsRepository')
    private programSpecialtyDiscountsRepository: IProgramSpecialtyDiscountsRepository,
  ) {}

  public async execute(
    patientId: string,
    specialtyId: string,
  ): Promise<IPrices> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    const specialty = await this.specialtiesRepository.findById(specialtyId);
    if (!specialty) {
      throw new AppError(
        'Especialidade não encontrada, verifique e tente novamente!',
      );
    }
    const { price } = specialty;

    if (!Number.isInteger(price)) {
      throw new AppError(
        'Nenhum preço foi encontrado, verifique e tente novamente!',
      );
    }

    const { planId, id } = patient;

    let discount = 0;

    if (planId) {
      const planSpecialtyDiscount =
        await this.planSpecialtyDiscountsRepository.findByPlanIdAndSpecialtyId(
          planId,
          specialtyId,
        );

      if (planSpecialtyDiscount) {
        discount += planSpecialtyDiscount.discount;
      }
    }

    // checa programas do paciente

    const patientPrograms =
      await this.patientProgramsRepository.findByPatientId(id);

    await Promise.all(
      patientPrograms.map(async patientProgram => {
        // checa programas para a specialty

        const programSpecialtyDiscount =
          await this.programSpecialtyDiscountsRepository.findByProgramIdAndSpecialtyId(
            patientProgram.programId,
            specialtyId,
          );

        if (programSpecialtyDiscount) {
          discount += programSpecialtyDiscount.discount;
        }
      }),
    );

    // soma tudo e retorna o desconto

    return {
      price: formatMoney(price),
      discount: formatMoney(discount),
      total: formatMoney(price - discount),
    };
  }
}
