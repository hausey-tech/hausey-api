import { injectable, inject } from 'tsyringe';

import { IPrescriptionsRepository } from '../contracts/repositories/prescriptions';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class DeletePrescriptionService {
  constructor(
    @inject('PrescriptionsRepository')
    private prescriptionsRepository: IPrescriptionsRepository,
  ) {}

  public async execute(externalId: number): Promise<void> {
    const prescription = await this.prescriptionsRepository.findByExternalId(
      externalId,
    );

    if (!prescription) {
      throw new AppError(
        'Prescrição não encontrada, verifique e tente novamente!',
      );
    }

    await this.prescriptionsRepository.delete(prescription.id);
  }
}
