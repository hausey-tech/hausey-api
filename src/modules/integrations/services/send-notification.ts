import { container, inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { type IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { type IUsersRepository } from '../../users/contracts/repositories/users';
import { type IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { SendFirebaseMessagingService } from './send-firebase-messaging';

interface IProps {
  userId?: string;
  patientId?: string;
  professionalId?: string;
  message: string;
}

@injectable()
export class SendNotificationService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('ProfessionalsRepository')
    private readonly professsionalsRepository: IProfessionalsRepository,

    @inject('PatientsRepository')
    private readonly patientsRepository: IPatientsRepository,
  ) {}

  public async execute({
    userId,
    patientId,
    professionalId,
    message,
  }: IProps): Promise<void> {
    let token = '';

    if (userId !== undefined) {
      const user = await this.usersRepository.findById(userId);
      if (user === null) {
        throw new AppError(
          'Nenhum usuário encontrado, verifique e tente novamente',
        );
      }
      token = user.fcmToken ?? '';
    } else if (professionalId !== undefined) {
      const professional = await this.professsionalsRepository.findById(
        professionalId,
      );
      if (professional === null) {
        throw new AppError(
          'Nenhuma Profissional encontrado, verifique e tente novamente',
        );
      }
      token = professional?.fcmToken ?? '';
    } else if (patientId !== undefined) {
      const patient = await this.patientsRepository.findById(patientId);
      if (patient === null) {
        throw new AppError(
          'Nenhuma paciente encontrado, verifique e tente novamente',
        );
      }
      token = patient?.fcmToken ?? '';
    }

    if (token === '') {
      throw new AppError(
        'O usuário/loja informado(a) não possui token de notificação!',
      );
    }

    const sendMessagingService = container.resolve(
      SendFirebaseMessagingService,
    );
    await sendMessagingService.execute({
      token,
      notification: { title: 'Nova mensagem!', body: message },
    });
  }
}
