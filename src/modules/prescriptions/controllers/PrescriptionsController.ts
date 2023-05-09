import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreatePrescriptionService } from '../services/CreatePrescriptionService';
import { DeletePrescriptionService } from '../services/DeletePrescriptionService';

export class PrescriptionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { appointmentId, externalId, token } = request.body;

    const createPrescriptionService = container.resolve(
      CreatePrescriptionService,
    );

    const appointment = await createPrescriptionService.execute({
      appointmentId,
      externalId,
      token,
    });

    return response.json(appointment);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { externalId } = request.params;

    const deletePrescriptionService = container.resolve(
      DeletePrescriptionService,
    );

    await deletePrescriptionService.execute(Number(externalId));

    return response.json({ message: 'Prescrição deletada com sucesso!' });
  }
}
