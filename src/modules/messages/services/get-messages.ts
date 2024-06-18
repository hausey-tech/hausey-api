import { injectable, inject } from 'tsyringe';
import { IPatientGroupsRepository } from '../../patients/contracts/repositories/patient-groups';
import { type IMessagesRepository } from '../contracts/repositories/messages-repository';
import { type IReadMessagesRepository } from '../contracts/repositories/read-messages-repository';
import { type Message } from '../entities/message-entity';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { AppError } from '../../../shared/errors/app-error';

interface IProps {
  userId: string;
}

@injectable()
export class GetUserMessagesService {
  constructor(
    @inject('MessagesRepository')
    private readonly messagesRepository: IMessagesRepository,

    @inject('PatientsRepository')
    private readonly patientsRepository: IPatientsRepository,

    @inject('PatientGroupsRepository')
    private readonly patientGroupsRepository: IPatientGroupsRepository,

    @inject('ReadMessagesRepository')
    private readonly readMessagesRepository: IReadMessagesRepository,
  ) {}

  public async execute({ userId }: IProps): Promise<Message[] | null> {
    const user = await this.patientsRepository.findById(userId);

    if (!user) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }
    const messages: Message[] = [];

    const messagesToAll =
      await this.messagesRepository.findByTypeAndDestination({
        type: 'push',
        destination: 'todos',
      });
    messages.push(...messagesToAll);

    const messagesToUser =
      await this.messagesRepository.findByTypeAndDestination({
        type: 'push',
        destination: userId,
      });
    messages.push(...messagesToUser);

    const patientGroups = await this.patientGroupsRepository.findByPatientId(
      userId,
    );

    const GroupNames = [];
    const GroupEnterDate = [];

    if (patientGroups.length > 0) {
      // eslint-disable-next-line array-callback-return
      await Promise.all(
        patientGroups.map(async pgroup => {
          // eslint-disable-next-line array-callback-return
          await pgroup.patientGroupTypes.map(groupType => {
            GroupNames.push(groupType.grouptype.name);
            GroupEnterDate.push(groupType.createdAt);
          });
        }),
      );
    }

    console.log('GroupNames', GroupNames);
    if (GroupNames.length > 0) {
      await Promise.all(
        GroupNames.map(async (nameGroup, index) => {
          const messagesByGroup =
            await this.messagesRepository.findByTypeAndDestination({
              type: 'push',
              destination: nameGroup,
            });
          console.log('messagesByGroup', messagesByGroup);
          const filteredMessages = messagesByGroup.filter(
            item => new Date(item.createdAt) > new Date(GroupEnterDate[index]),
          );
          messages.push(...filteredMessages);
        }),
      );
    }

    // const readMessages = await this.readMessagesRepository.findByUserId(userId);

    // const unreadMessages = messages.filter(message => {
    //   return !readMessages.some(
    //     readMessage => readMessage.messageId === message.id,
    //   );
    // });

    // if (unreadMessages.length === 0) return null;

    // const messageToSend = unreadMessages[0];

    // await this.readMessagesRepository.create({
    //   messageId: messageToSend.id,
    //   userId,
    // });
    console.log('final messages', messages);
    return messages;
  }
}
