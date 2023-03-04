import { Entity } from 'typeorm';

import { UserEntity } from '../../../shared/typeorm/entities';

@Entity('secretaries')
export class Secretary extends UserEntity {}
