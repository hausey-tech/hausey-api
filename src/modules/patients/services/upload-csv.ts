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
    console.log('entrei no execute e vou exibir o file:', file);
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream(file.path)
        .pipe(
          csv({
            mapHeaders: ({ header }) => header.trim(),
            mapValues: ({ value }) => value.trim(),
          }),
        )
        .on('data', data => {
          console.log('Linha do CSV:', data); // Log cada linha do CSV
          results.push(data);
        })
        .on('end', async () => {
          try {
            console.log('Processando linhas do CSV...'); // Log início do processamento
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

                console.log('Criando paciente:', patientDto); // Log antes de criar o paciente
                await this.patientsRepository.create(patientDto);
                console.log('Paciente criado com sucesso.'); // Log após criar o paciente
              }),
            );

            resolve('CSV processado com sucesso.');
          } catch (error) {
            console.error('Erro ao processar CSV:', error); // Log detalhado do erro
            this.logger.error(
              {
                message: error.message,
                stack: error.stack,
              },
              'Erro ao processar CSV',
            );
            reject(new AppError('Erro ao processar CSV.', 500));
          }
        })
        .on('error', error => {
          console.error('Erro ao ler o arquivo CSV:', error); // Log detalhado do erro
          this.logger.error(
            {
              message: error.message,
              stack: error.stack,
            },
            'Erro ao ler o arquivo CSV',
          );
          reject(new AppError('Erro ao ler o arquivo CSV.', 500));
        });
    });
  }
}
