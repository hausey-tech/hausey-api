import { injectable, inject, container } from 'tsyringe';
import { SendFirebaseMessagingService } from '../../integrations/services/send-firebase-messaging';

import { type ICreateMessageDTO } from '../contracts/dtos/create-message-dto';
import { type IMessagesRepository } from '../contracts/repositories/messages-repository';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { type Patient } from '../../patients/entities/patient';
import { GetPatientsByGroupService } from '../../patients/services/get-patients-by-group';
import { IGroupTypesRepository } from '../../group-type/contracts/repositories/group-types';

@injectable()
export class CreateMessageService {
  constructor(
    @inject('MessagesRepository')
    private readonly messagesRepository: IMessagesRepository,

    @inject('PatientsRepository')
    private readonly patientsRepository: IPatientsRepository,

    @inject('GroupTypesRepository')
    private readonly groupTypesRepository: IGroupTypesRepository,
  ) {}

  public async execute({
    type,
    to,
    title,
    body,
    link,
  }: ICreateMessageDTO): Promise<void> {
    if (typeof title === 'string' && typeof body === 'string') {
      let users: Patient[] = [];
      if (to === 'todos') {
        users = await this.patientsRepository.find();
      } else {
        const groupTypes: string[] = [];
        const groupId = await this.groupTypesRepository.findByName(to);

        const getPatientsByGroupService = container.resolve(
          GetPatientsByGroupService,
        );
        groupTypes.push(groupId.id);
        users = await getPatientsByGroupService.execute({
          groupTypes,
        });
      }
      if (users) {
        const usersWithFcm = users?.filter(
          user => typeof user.fcmToken === 'string',
        );
        try {
          await Promise.all(
            usersWithFcm.map(async user => {
              const sendPushService = container.resolve(
                SendFirebaseMessagingService,
              );
              await sendPushService.execute({
                token: user.fcmToken as string,
                notification: { title, body },
                data: { link },
              });
            }),
          );
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
