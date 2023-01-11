import { injectable } from 'tsyringe';

import { memedInstance } from '../utils/memed-instance';

@injectable()
export class CreateMemedUser {
  public async execute(payload: any): Promise<any> {
    const { data } = await memedInstance.post(
      `/sinapse-prescricao/usuarios`,
      payload,
    );
    return {
      userToken: data?.data?.attributes?.token,
      user: data?.data?.attributes,
    };
  }
}
