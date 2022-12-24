export const memedUserSchema = {
  type: 'object',
  properties: {
    userToken: {
      type: 'string',
    },
    user: {
      type: 'object',
      properties: {
        nome: {
          type: 'string',
        },
        sobrenome: {
          type: 'string',
        },
        cpf: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        data_nascimento: {
          type: 'string',
        },
        sexo: {
          type: 'string',
        },
        avatar: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
        ambiente: {
          type: 'string',
        },
        is_editor: {
          type: 'number',
        },
        user_name: {
          type: 'string',
        },
        biografia: {
          type: 'string',
        },
        imagem_capa: {
          type: 'string',
        },
        terms_accepted: {
          type: 'number',
        },
        cidade: {
          type: 'string',
        },
        clinica_ativa: {
          type: 'string',
        },
        cns: {
          type: 'string',
        },
        cnes: {
          type: 'string',
        },
        configuracoes: {
          type: 'string',
        },
        crm: {
          type: 'string',
        },
        endereco: {
          type: 'string',
        },
        especialidade: {
          type: 'string',
        },
        estudante: {
          type: 'boolean',
        },
        farmacia_artesanal: {
          type: 'boolean',
        },
        iamspe: {
          type: 'boolean',
        },
        is_partner: {
          type: 'boolean',
        },
        nome_completo: {
          type: 'string',
        },
        perola_byington: {
          type: 'boolean',
        },
        sociedades: {
          type: 'string',
        },
        telefone: {
          type: 'string',
        },
        token: {
          type: 'string',
        },
        uf: {
          type: 'string',
        },
        universidade: {
          type: 'string',
        },
        fabricante: {
          type: 'string',
        },
        user_type: {
          type: 'string',
        },
        total_of_prescriptions: {
          type: 'number',
        },
        total_of_prescripted_drugs: {
          type: 'number',
        },
        total_of_sms_prescriptions: {
          type: 'number',
        },
        synchronized: {
          type: 'boolean',
        },
        percentage_of_completed_profile: {
          type: 'number',
        },
        parceiros_id: {
          type: 'number',
        },
        filter_web_pki_certificates_by_cpf: {
          type: 'boolean',
        },
      },
    },
  },
};
