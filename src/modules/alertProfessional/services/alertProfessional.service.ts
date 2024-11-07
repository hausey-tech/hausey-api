import { CreateCallService } from 'modules/integrations/services/programmable-voice-twilio';
import { IProfessionalsRepository } from 'modules/professionals/contracts/repositories/professionals';
import { inject, injectable } from 'tsyringe';

interface IProfessionalDTO {
  professionalId?: string;
}

@injectable()
export class AlertProfessionalService {
  constructor(
    @inject('CreateCallService')
    private service: CreateCallService,

    @inject('ProfessionalsRepository')
    private professionalRepository: IProfessionalsRepository,
  ) {}

  public async execute({ professionalId }: IProfessionalDTO): Promise<any> {
    console.log(professionalId);
    // const slotService = container.resolve(FindSlotsService);
    // const slots = await slotService.execute({
    //   professionalId: professionalId as string,
    // });
  }
}
