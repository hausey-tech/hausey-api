export const patientsPath = {
  post: {
    tags: ['Patients'],
    summary: 'Creates a user and patient',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/createUserAndPatient',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/patientSession',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      401: {
        $ref: '#/components/unauthorized',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
  anamneses: {
    post: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Patients'],
      summary: 'Creates a patient anamnesis',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/createPatientAnamnesis',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                $ref: '#/schemas/patientAnamnesis',
              },
            },
          },
        },
        400: {
          $ref: '#/components/badRequest',
        },
        401: {
          $ref: '#/components/unauthorized',
        },
        404: {
          $ref: '#/components/notFound',
        },
        500: {
          $ref: '#/components/serverError',
        },
      },
    },
  },
  primaryDiagnoses: {
    post: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Patients'],
      summary: 'Creates a patient primary diagnosis',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/createPatientAnamnesis',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                $ref: '#/schemas/patientAnamnesis',
              },
            },
          },
        },
        400: {
          $ref: '#/components/badRequest',
        },
        401: {
          $ref: '#/components/unauthorized',
        },
        404: {
          $ref: '#/components/notFound',
        },
        500: {
          $ref: '#/components/serverError',
        },
      },
    },
  },
};
