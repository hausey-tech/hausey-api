import { injectable, inject } from 'tsyringe';

import { ISellerCodeSellersRepository } from '../../seller-code-sellers/contracts/repositories/seller-code-sellers-repository';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';
import { SellerCode } from '../../seller-codes/entities/seller-code';

interface PatientResponse {
  patients: Array<Patient>;
  sellerCodesFiltered: Array<SellerCode>;
}

@injectable()
export class ListPatientsService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('SellerCodeSellers')
    private sellerCodeSellersRepository: ISellerCodeSellersRepository,

    @inject('SellerCodes')
    private sellerCodesRepository: ISellerCodesRepository,
  ) {}

  public async execute(query: {
    professionalId?: string;
    userId?: string;
    type?: string;
  }): Promise<PatientResponse> {
    const { professionalId, userId, type } = query;

    let sellerCodesFiltered;
    if (professionalId) {
      const appointments = await this.appointmentsRepository.findByProfessional(
        professionalId,
      );

      const patientIds = appointments.map(appointment => appointment.patientId);

      const patients = await this.patientsRepository.findByIds(patientIds);

      if (userId) {
        const sellerCodeSellers =
          await this.sellerCodeSellersRepository.findBySellerId(userId);

        const sellerCodes = await Promise.all(
          sellerCodeSellers.map(async sellerCodeSeller => {
            return this.sellerCodesRepository.findById(sellerCodeSeller.id);
          }),
        );

        sellerCodesFiltered = sellerCodes.filter(
          sellerCode => sellerCode.type === type,
        );
      }

      return { patients, sellerCodesFiltered };
    }

    if (userId) {
      const sellerCodeSellers =
        await this.sellerCodeSellersRepository.findBySellerId(userId);

      const sellerCodes = await Promise.all(
        sellerCodeSellers.map(async sellerCodeSeller => {
          return this.sellerCodesRepository.findById(sellerCodeSeller.id);
        }),
      );
      sellerCodesFiltered = sellerCodes.filter(
        sellerCode => sellerCode.type === type,
      );
    }

    const patients = await this.patientsRepository.find();

    return { patients, sellerCodesFiltered };
  }
}
