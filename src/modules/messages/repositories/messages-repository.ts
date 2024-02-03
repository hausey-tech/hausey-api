import { LessThan, MoreThan, type Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import {
  type IMessagesRepository,
  type ICreateMessage,
  type ITypeAndDestination,
} from '../contracts/repositories/messages-repository';
import { Message } from '../entities/message-entity';

export class MessagesRepository implements IMessagesRepository {
  private readonly ormRepository: Repository<Message>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Message);
  }

  public async findById(id: string): Promise<Message | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByTypeAndDestination({
    type,
    destination,
  }: ITypeAndDestination): Promise<Message[]> {
    return this.ormRepository.find({
      where: {
        type,
        to: destination,
        startsAt: LessThan(new Date()),
        expiresAt: MoreThan(new Date()),
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  public async create(payload: ICreateMessage): Promise<Message> {
    const message = this.ormRepository.create(payload);
    return this.ormRepository.save(message);
  }

  public async save(message: Message): Promise<Message> {
    return this.ormRepository.save(message);
  }
}
