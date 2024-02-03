import { injectable, inject } from 'tsyringe';
import { type IMessagesRepository } from '../contracts/repositories/messages-repository';
import { type IReadMessagesRepository } from '../contracts/repositories/read-messages-repository';
import { type Message } from '../entities/message-entity';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';

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

    @inject('ReadMessagesRepository')
    private readonly readMessagesRepository: IReadMessagesRepository,
  ) {}

  public async execute({ userId }: IProps): Promise<Message | null> {
    const user = await this.patientsRepository.findById(userId);

    if (user === null) return null;

    const messages = await this.messagesRepository.findByTypeAndDestination({
      type: 'inApp',
      destination: user.name,
    });
    const readMessages = await this.readMessagesRepository.findByUserId(userId);

    const unreadMessages = messages.filter(message => {
      return !readMessages.some(
        readMessage => readMessage.messageId === message.id,
      );
    });

    if (unreadMessages.length === 0) return null;

    const messageToSend = unreadMessages[0];

    await this.readMessagesRepository.create({
      messageId: messageToSend.id,
      userId,
    });

    return messageToSend;
  }
}
