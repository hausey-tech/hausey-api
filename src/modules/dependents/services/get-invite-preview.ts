import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { IGetInvitePreviewDTO } from '../contracts/dtos/get-invite-preview-dto';
import { DependentStatus } from '../entities/patient-dependent';

interface Response {
  holderName: string;
  email: string | null;
  status: DependentStatus;
  inviteExpiresAt: Date | null;
}

@injectable()
export class GetInvitePreviewService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,
  ) {}

  public async execute({
    inviteToken,
  }: IGetInvitePreviewDTO): Promise<Response> {
    const dependent = await this.dependentsRepository.findByInviteToken(
      inviteToken,
    );

    if (!dependent) {
      throw new AppError('Convite não encontrado.', 404);
    }

    return {
      holderName: dependent.holder.name,
      email: dependent.email,
      status: dependent.status,
      inviteExpiresAt: dependent.inviteExpiresAt,
    };
  }
}
