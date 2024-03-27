import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateMedicalRecordService } from '../services/create-medical-record-service';
import { ListMedicalRecordsService } from '../services/list-medical-records-service';

export class MedicalRecordsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { patientId } = request.query;
    const listMedicalRecordsService = container.resolve(
      ListMedicalRecordsService,
    );
    const medicalRecords = await listMedicalRecordsService.execute({
      patientId: patientId as string,
    });
    return response.json(medicalRecords);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { appointmentId, description, cids, restricted } = request.body;
    const createMedicalRecordService = container.resolve(
      CreateMedicalRecordService,
    );
    const medicalRecord = await createMedicalRecordService.execute({
      appointmentId,
      description,
      cids,
      restricted,
    });
    return response.json(medicalRecord);
  }
}
