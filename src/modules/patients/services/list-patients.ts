import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodeSellersRepository } from '../../seller-code-sellers/contracts/repositories/seller-code-sellers-repository';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';
import { SellerCode } from '../../seller-codes/entities/seller-code';

interface PatientsPaginatedResponse {
  patients: Array<Patient>;
  totalPatients: number;
  totalPages: number;
}

interface SellerCodeResponse {
  sellerCodes: Array<SellerCode>;
  patients: PatientsPaginatedResponse;
}

@injectable()
export class ListPatientsService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('SellerCodeSellersRepository')
    private sellerCodeSellersRepository: ISellerCodeSellersRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,
  ) {}

  public async execute(query: {
    professionalId?: string;
    userId?: string;
    type?: string;
    page?: string;
    limit?: string;
    name?: string;
    cpf?: string;
  }): Promise<
    SellerCodeResponse | PatientsPaginatedResponse | Patient | Patient[]
  > {
    const {
      professionalId,
      userId,
      type,
      page = 1,
      limit = 10,
      name,
      cpf,
    } = query;
    let sellerCodesFiltered;

    if (name) {
      return this.patientsRepository.findByName(name);
    }

    if (cpf) {
      return this.patientsRepository.findByDocument(cpf);
    }

    if (Number.isNaN(page) || Number(page) < 1) {
      throw new AppError('Page must be a valid number');
    }

    if (Number.isNaN(limit) || Number(limit) < 1) {
      throw new AppError('Invalid limit value');
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    if (professionalId) {
      const appointments = await this.appointmentsRepository.findByProfessional(
        professionalId,
      );

      const patientIds = appointments.map(appointment => appointment.patientId);

      const [patients, totalPatients] = await this.patientsRepository.findByIds(
        patientIds,
        skip,
        take,
      );

      const totalPages = Math.ceil(totalPatients / take);

      return {
        patients,
        totalPatients,
        totalPages,
      };
    }

    if (userId) {
      const sellerCodeSellers =
        await this.sellerCodeSellersRepository.findBySellerId(userId);

      const [patients, totalPatients] =
        await this.patientsRepository.findBySellerId(userId, skip, take);

      const totalPages = Math.ceil(totalPatients / take);

      const sellerCodes = await Promise.all(
        sellerCodeSellers.map(async sellerCodeSeller => {
          const sellerCode = await this.sellerCodesRepository.findById(
            sellerCodeSeller.sellerCodeId,
          );
          const sellerInfo = {
            phone: sellerCodeSeller.seller.phoneNumber,
            email: sellerCodeSeller.seller.email,
            name: sellerCodeSeller.seller.name,
            sellerCode,
          };
          return sellerInfo;
        }),
      );
      sellerCodesFiltered = sellerCodes.filter(
        sellerCode => sellerCode.sellerCode.type === type,
      );
      return {
        sellerCodes: sellerCodesFiltered,
        patients: { patients, totalPatients, totalPages },
      };
    }

    const [patients, totalPatients] = await this.patientsRepository.find(
      skip,
      take,
    );

    const totalPages = Math.ceil(totalPatients / take);

    return {
      patients,
      totalPatients,
      totalPages,
    };
  }
}
