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
};
