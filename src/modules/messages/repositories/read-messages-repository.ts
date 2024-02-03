import { type Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import {
  type ICreateReadMessage,
  type IReadMessagesRepository,
} from '../contracts/repositories/read-messages-repository';
import { ReadMessage } from '../entities/read-message-entity';

export class ReadMessagesRepository implements IReadMessagesRepository {
  private readonly ormRepository: Repository<ReadMessage>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(ReadMessage);
  }

  public async findByUserId(userId: string): Promise<ReadMessage[]> {
    return this.ormRepository.find({ where: { userId } });
  }

  public async create(payload: ICreateReadMessage): Promise<ReadMessage> {
    const message = this.ormRepository.create(payload);
    return this.ormRepository.save(message);
  }

  public async save(readMessage: ReadMessage): Promise<ReadMessage> {
    return this.ormRepository.save(readMessage);
  }
}
