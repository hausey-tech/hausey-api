import { injectable, inject } from 'tsyringe';
import fs from 'fs';
import csv from 'csv-parser';
import { Logger } from 'pino';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { ICreatePatientDTO } from '../contracts/dtos/create-patient';

@injectable()
export class UploadPatientCsv {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream(file.path)
        .pipe(
          csv({
            mapHeaders: ({ header }) => header.trim(),
            mapValues: ({ value }) => value.trim(),
          }),
        )
        .on('data', data => results.push(data))
        .on('end', async () => {
          try {
            await Promise.all(
              results.map(async row => {
                const {
                  name,
                  email,
                  password,
                  phoneNumber,
                  document,
                  birthdate,
                  sex,
                } = row;

                if (
                  !name ||
                  !email ||
                  !password ||
                  !phoneNumber ||
                  !document ||
                  !birthdate ||
                  !sex
                ) {
                  this.logger.info(
                    {
                      message: row,
                    },
                    'Linha inválida no CSV',
                  );
                  return;
                }

                const patientDto: ICreatePatientDTO = {
                  name,
                  email,
                  password,
                  phoneNumber,
                  document,
                  birthdate,
                  sex,
                  sellerId: 'e00f4434-bc81-4569-ad30-8187668d43b6',
                  firstPayment: true,
                  planId: 'efe8d3ec-f3a2-432b-8a10-d7ef75e5adc2',
                };

                await this.patientsRepository.create(patientDto);
              }),
            );

            resolve('CSV processado com sucesso.');
          } catch (error) {
            this.logger.info(
              {
                message: error,
              },
              'Erro ao processar CSV',
            );
            reject(new AppError('Erro ao processar CSV.', 500));
          }
        })
        .on('error', error => {
          this.logger.info(
            {
              message: error,
            },
            'Erro ao ler o arquivo CSV',
          );
          reject(new AppError('Erro ao ler o arquivo CSV.', 500));
        });
    });
  }
}
