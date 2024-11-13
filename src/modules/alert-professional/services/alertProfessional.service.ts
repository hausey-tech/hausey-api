import { container, injectable } from 'tsyringe';
import { CreateCallService } from '../../integrations/services/programmable-voice-twilio';

@injectable()
export class AlertProfessionalService {
  public async execute(): Promise<any> {
    // const tries = 1;
    const callService = container.resolve(CreateCallService);

    await callService.createCall();
  }
}
