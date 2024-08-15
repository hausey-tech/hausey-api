import { injectable, inject, container } from 'tsyringe';
import { SendFirebaseMessagingService } from '../../integrations/services/send-firebase-messaging';

import { type ICreateMessageDTO } from '../contracts/dtos/create-message-dto';
import { type IMessagesRepository } from '../contracts/repositories/messages-repository';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { AppError } from '../../../shared/errors/app-error';

interface IProps extends Omit<ICreateMessageDTO, 'to'> {
  to: string[] | string;
}

@injectable()
export class CreateMessageToUserService {
  constructor(
    @inject('MessagesRepository')
    private readonly messagesRepository: IMessagesRepository,

    @inject('PatientsRepository')
    private readonly patientsRepository: IPatientsRepository,
  ) {}

  public async execute({ type, to, title, body, link }: IProps): Promise<void> {
    if (Array.isArray(to)) {
      await Promise.all(
        to.map(async userId => {
          const user = await this.patientsRepository.findById(userId);
          if (user) {
            if (user.fcmToken) {
              const sendPushService = container.resolve(
                SendFirebaseMessagingService,
              );
              await sendPushService.execute({
                token: user.fcmToken as string,
                notification: { title, body },
                data: link ? { link } : undefined,
              });
            }
            await this.messagesRepository.create({
              type,
              to: userId,
              title,
              body,
              link,
            });
          }
        }),
      );
    } else {
      const user = await this.patientsRepository.findById(to);
      if (!user) {
        throw new AppError(
          'Paciente não encontrado, verifique e tente novamente!',
        );
      }
      if (user.fcmToken) {
        try {
          const sendPushService = container.resolve(
            SendFirebaseMessagingService,
          );
          await sendPushService.execute({
            token: user.fcmToken as string,
            notification: { title, body },
            data: { link },
          });
        } catch {
          console.log('Erro ao enviar FCM');
        }
      }

      await this.messagesRepository.create({
        type,
        to,
        title,
        body,
        link,
      });
    }
  }
}
