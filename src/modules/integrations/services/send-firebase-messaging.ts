import { injectable } from 'tsyringe';
import { firebaseMessagingInstance } from '../utils/firebase-instance';

interface IProps {
  token: string;
  notification: {
    title: string;
    body: string;
  };
  data?: {
    link: string;
  };
}

@injectable()
export class SendFirebaseMessagingService {
  public async execute({ token, notification, data }: IProps): Promise<void> {
    try {
      await firebaseMessagingInstance.send({ token, notification, data });
    } catch (error) {
      console.error({
        message: 'Error on sending notification',
        token,
        error: error.errorInfo.code,
      });
    }
  }
}
