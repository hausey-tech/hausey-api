import { injectable } from 'tsyringe';

import { memedInstance } from '../utils/memed-instance';

@injectable()
export class SearchMemedUser {
  public async execute(token: string): Promise<any> {
    const { data } = await memedInstance.get(
      `/sinapse-prescricao/usuarios/${token}`,
    );
    return {
      userToken: data?.data?.attributes?.token,
      user: data?.data?.attributes,
    };
  }
}
