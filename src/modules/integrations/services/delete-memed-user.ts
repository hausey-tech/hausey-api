import { injectable } from 'tsyringe';

import { memedInstance } from '../utils/memed-instance';

@injectable()
export class DeleteMemedUser {
  public async execute(id: any): Promise<void> {
    await memedInstance.delete(`/sinapse-prescricao/usuarios/${id}`);
  }
}
