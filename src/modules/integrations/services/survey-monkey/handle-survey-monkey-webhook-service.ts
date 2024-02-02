import { injectable } from 'tsyringe';

@injectable()
export class HandleSurveyMonkeyWebhookService {
  public async execute({ body }: { body: any }): Promise<any> {
    console.log('HandleSurveyMonkeyWebhookService: ', body);
  }
}
