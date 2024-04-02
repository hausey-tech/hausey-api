export const patientsPath = {
  post: {
    tags: ['Patients'],
    summary: 'Creates a patient type of user',
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
  patientId: {
    plan: {
      patch: {
        security: [
          {
            bearerAuth: [],
            apiKey: [],
          },
        ],
        tags: ['Patients'],
        summary: 'Updated patient plan status',
        parameters: [
          {
            in: 'path',
            name: 'patientId',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'Patient UUID',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/schemas/updatePatientPlan',
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
                  $ref: '#/schemas/patient',
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
  },
};
