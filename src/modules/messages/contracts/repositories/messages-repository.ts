import { type Message } from '../../entities/message-entity';

export interface ICreateMessage {
  type: string;
  to: string;
  image?: string;
  title?: string;
  body?: string;
  startsAt?: string;
  expiresAt?: string;
}

export interface ITypeAndDestination {
  type: 'inApp' | 'push';
  destination: string;
}

export interface IMessagesRepository {
  findById: (id: string) => Promise<Message | null>;
  findByTypeAndDestination: ({
    type,
    destination,
  }: ITypeAndDestination) => Promise<Message[]>;
  create: (payload: ICreateMessage) => Promise<Message>;
  save: (message: Message) => Promise<Message>;
}
