import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { formatMoney } from '../../../shared/utils/format-money';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPatientProgramsRepository } from '../../patients/contracts/repositories/patient-programs';
import { IProfessionalSpecialtiesRepository } from '../../professionals/contracts/repositories/professional-specialties';
import { IProfessionalTypesRepository } from '../../professionals/contracts/repositories/professional-types';
import { IPlanProfessionalTypeDiscountsRepository } from '../../plans/contracts/repositories/plan-professional-type-discounts';
import { IPlanProfessionalSpecialtyDiscountsRepository } from '../../plans/contracts/repositories/plan-professional-specialty-discounts';
import { IProgramProfessionalTypeDiscountsRepository } from '../../programs/contracts/repositories/program-professional-type-discounts';
import { IProgramProfessionalSpecialtyDiscountsRepository } from '../../programs/contracts/repositories/program-professional-specialty-discounts';

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

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,

    @inject('ProfessionalTypesRepository')
    private professionalTypesRepository: IProfessionalTypesRepository,

    @inject('PlanProfessionalTypeDiscountsRepository')
    private planProfessionalTypeDiscountsRepository: IPlanProfessionalTypeDiscountsRepository,

    @inject('PlanProfessionalSpecialtyDiscountsRepository')
    private planProfessionalSpecialtyDiscountsRepository: IPlanProfessionalSpecialtyDiscountsRepository,

    @inject('ProgramProfessionalTypeDiscountsRepository')
    private programProfessionalTypeDiscountsRepository: IProgramProfessionalTypeDiscountsRepository,

    @inject('ProgramProfessionalSpecialtyDiscountsRepository')
    private programProfessionalSpecialtyDiscountsRepository: IProgramProfessionalSpecialtyDiscountsRepository,
  ) {}

  public async execute(
    patientId: string,
    professionalTypeId: string,
    professionalSpecialtyId: string,
  ): Promise<IPrices> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    let price: number;

    // checa se tem specialtyId e se tiver pega o price

    if (professionalSpecialtyId) {
      const professionalSpecialty =
        await this.professionalSpecialtiesRepository.findById(
          professionalSpecialtyId,
        );
      if (!professionalSpecialty) {
        throw new AppError(
          'Especialidade não encontrada, verifique e tente novamente!',
        );
      }
      price = professionalSpecialty.price;
    }

    // checa se tem typeId e se ainda nao foi atribuido nada ao price

    if (professionalTypeId && !Number.isInteger(price)) {
      const professionalType = await this.professionalTypesRepository.findById(
        professionalTypeId,
      );
      if (!professionalType) {
        throw new AppError(
          'Tipo de profissional não encontrado, verifique e tente novamente!',
        );
      }
      price = professionalType.price;
    }

    if (!Number.isInteger(price)) {
      throw new AppError(
        'Nenhum preço foi encontrado, verifique e tente novamente!',
      );
    }

    const { planId, id } = patient;

    let discount = 0;

    if (planId) {
      // checa o plano para a specialty

      const planSpecialtyDiscount =
        await this.planProfessionalSpecialtyDiscountsRepository.findByPlanIdAndProfessionalSpecialtyId(
          planId,
          professionalSpecialtyId,
        );

      if (planSpecialtyDiscount) {
        discount += planSpecialtyDiscount.discount;
      }

      // checa o plano para o type

      const planTypeDiscount =
        await this.planProfessionalTypeDiscountsRepository.findByPlanIdAndProfessionalTypeId(
          planId,
          professionalTypeId,
        );

      if (planTypeDiscount) {
        discount += planTypeDiscount.discount;
      }
    }

    // checa programas do paciente

    const patientPrograms =
      await this.patientProgramsRepository.findByPatientId(id);

    await Promise.all(
      patientPrograms.map(async patientProgram => {
        // checa programas para a specialty

        const programSpecialtyDiscount =
          await this.programProfessionalSpecialtyDiscountsRepository.findByProgramIdAndProfessionalSpecialtyId(
            patientProgram.programId,
            professionalSpecialtyId,
          );

        if (programSpecialtyDiscount) {
          discount += programSpecialtyDiscount.discount;
        }

        // checa programa para o type

        const programTypeDiscount =
          await this.programProfessionalTypeDiscountsRepository.findByProgramIdAndProfessionalTypeId(
            patientProgram.programId,
            professionalTypeId,
          );

        if (programTypeDiscount) {
          discount += programTypeDiscount.discount;
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
