import { Request, Response } from 'express';

export class AppointmentsController {
  public async read(request: Request, response: Response): Promise<Response> {
    const { appointmentId } = request.params;

    return response.json({ appointmentId });
  }
}
