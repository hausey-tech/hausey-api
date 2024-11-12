import { CreateCallService } from 'modules/integrations/services/programmable-voice-twilio';
import { inject, injectable } from 'tsyringe';

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
