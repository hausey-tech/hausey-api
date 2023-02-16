import { injectable } from 'tsyringe';
import { memedInstance } from '../utils/memed-instance';

interface Props {
  cpf: string;
  crm: string;
}

@injectable()
export class CheckIfMemedUserAlreadyExists {
  public async execute({ cpf, crm }: Props): Promise<any | null> {
    try {
      const { data } = await memedInstance.get(
        `/sinapse-prescricao/usuarios/${cpf}`,
      );
      return {
        userToken: data?.data?.attributes?.token,
        user: data?.data?.attributes,
      };
    } catch (err1) {
      try {
        const { data } = await memedInstance.get(
          `/sinapse-prescricao/usuarios/${crm}`,
        );
        return {
          userToken: data?.data?.attributes?.token,
          user: data?.data?.attributes,
        };
      } catch (err2) {
        return null;
      }
    }
  }
}
