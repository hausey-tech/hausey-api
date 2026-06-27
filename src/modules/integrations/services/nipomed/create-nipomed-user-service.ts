import { container, inject, injectable } from 'tsyringe';
import { format } from 'date-fns';
import { nipomedInstance } from '../../utils/nipomed-instance';
import { Patient } from '../../../patients/entities/patient';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { CreateErrorService } from '../../../errors/service/create-error-service';

interface IProps {
  patient: Patient;
  expiresAt: string;
}

@injectable()
export class CreateNipomedUserService {
  constructor(
    @inject('PatientsRepository')
    private readonly patientsRepository: IPatientsRepository,
  ) {}

  public async execute({ patient, expiresAt }: IProps): Promise<void> {
    try {
      if (patient.isPro && patient.address) {
        const tipoPlano =
          patient.plan?.type === 'Familiar' ? 'FAMILIAR' : 'INDIVIDUAL';

        await nipomedInstance.post('', {
          token: process.env.NIPOMED_TOKEN,
          clientes: [
            {
              StatusRegistro: '1',
              TipoPlano: tipoPlano,
              TipoAssociado: 'TITULAR',
              Matricula: patient.document?.replace(/\D/g, ''),
              Nome: patient.name?.trim(),
              DataNascimento: patient.birthdate,
              CPF: patient.document,
              Celular: patient.phoneNumber?.slice(3),
              Email: patient.email?.trim(),
              DataVencimento: format(new Date(expiresAt), 'dd/MM/yyyy'),
              Sexo: patient.sex === 'M' ? 'MASCULINO' : 'FEMININO',
              Endereco: patient.address.addressLine1?.trim(),
              Bairro: 'Nd',
              Complemento: patient.address.addressLine2?.trim(),
              Cidade: patient.address.city?.trim(),
              Estado: patient.address.state?.trim(),
              CEP: patient.address.zipOrPostcode?.replace(/\D/g, ''),
            },
          ],
        });
        if (!patient.nipomed) {
          await this.patientsRepository.update(patient.id, { nipomed: true });
        }
      }
    } catch (err) {
      const createErrorService = container.resolve(CreateErrorService);
      createErrorService.execute({
        statusCode: 500,
        message: `Erro ao criar usuário na Nipomed\nPatientId: ${
          patient.id
        }\nMensagem:${
          err?.response?.data?.clientes?.message ?? 'Indefinido'
        }\nErros: ${
          err?.response?.data?.clientes?.errors
            ?.map(e => e?.mensagem)
            .join(', ') ?? 'Indefinido'
        }`,
      });
    }
  }
}
