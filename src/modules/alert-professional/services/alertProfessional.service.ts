import { inject, injectable } from 'tsyringe';
import { CreateCallService } from '../../integrations/services/programmable-voice-twilio';

@injectable()
export class AlertProfessionalService {
  constructor(
    @inject('CreateCallService')
    private service: CreateCallService,
  ) {}

  public async execute(): Promise<any> {
    // const tries = 1;
    await this.service.createCall();
  }
}
