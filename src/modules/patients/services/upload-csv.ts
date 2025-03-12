import { injectable, inject } from 'tsyringe';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { Logger } from 'pino';
import { IAddressesRepository } from 'modules/addresses/contracts/repositories/IAddressesRepository';
import { ICreateAddressDTO } from 'modules/addresses/contracts/dtos/ICreateAddressDTO';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { ICreatePatientDTO } from '../contracts/dtos/create-patient';
import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';

@injectable()
export class UploadPatientCsv {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('Logger')
    private logger: Logger,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute(file: any): Promise<string> {
    console.log('entrei no execute e vou exibir o file:', file);

    // Verifica se o buffer do arquivo existe
    if (!file.buffer) {
      console.error('Buffer do arquivo não encontrado.');
      throw new AppError('Buffer do arquivo não encontrado.', 400);
    }

    return new Promise((resolve, reject) => {
      const results: any[] = [];

      console.log('Iniciando leitura do arquivo CSV...'); // Log antes de ler o arquivo

      // Cria um stream a partir do buffer
      const stream = Readable.from(file.buffer);

      stream
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
          console.log('Leitura do arquivo CSV concluída.'); // Log após ler o arquivo
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
                  addressLine1,
                  addressLine2,
                  city,
                  state,
                  zipOrPostcode,
                  country,
                } = row;

                if (
                  !name ||
                  !email ||
                  !password ||
                  !phoneNumber ||
                  !document ||
                  !birthdate ||
                  !sex ||
                  !addressLine1 ||
                  !addressLine2 ||
                  !city ||
                  !state ||
                  !zipOrPostcode
                ) {
                  this.logger.info(
                    {
                      message: row,
                    },
                    'Linha inválida no CSV',
                  );
                  return;
                }

                let hashedPassword: string;

                if (password) {
                  hashedPassword = await this.hashProvider.generateHash(
                    password,
                  );
                }

                const patientDto: ICreatePatientDTO = {
                  name,
                  email,
                  password: hashedPassword,
                  phoneNumber,
                  document,
                  birthdate,
                  sex,
                  sellerId: 'e00f4434-bc81-4569-ad30-8187668d43b6',
                  firstPayment: true,
                  planId: 'efe8d3ec-f3a2-432b-8a10-d7ef75e5adc2',
                };

                const patient = await this.patientsRepository.create(
                  patientDto,
                );

                const addressDto: ICreateAddressDTO = {
                  patientId: patient.id,
                  addressLine1,
                  addressLine2,
                  city,
                  state,
                  zipOrPostcode,
                  country,
                };

                const address = await this.addressesRepository.create(
                  addressDto,
                );
                await this.addressesRepository.save(address);
              }),
            );

            resolve('CSV processado com sucesso.');
          } catch (error) {
            console.error('Erro ao processar CSV:', error);
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
