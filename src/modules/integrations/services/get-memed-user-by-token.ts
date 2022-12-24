import { injectable } from 'tsyringe';

import { memedInstance } from '../utils/memed-instance';

@injectable()
export class GetMemedUserByToken {
  public async execute(token: string): Promise<any> {
    const { data } = await memedInstance.get(`/usuarios?token=${token}`);
    return {
      userToken: data?.data?.attributes?.token,
      user: data?.data?.attributes,
    };
  }
}
