import { type ReadMessage } from '../../entities/read-message-entity';

export interface ICreateReadMessage {
  messageId: string;
  userId: string;
}

export interface IReadMessagesRepository {
  findByUserId: (id: string) => Promise<ReadMessage[]>;
  create: (payload: ICreateReadMessage) => Promise<ReadMessage>;
  save: (readMessage: ReadMessage) => Promise<ReadMessage>;
}
