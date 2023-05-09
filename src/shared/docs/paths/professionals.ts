export const professionalsPath = {
  get: {
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: ['Professionals'],
    summary: 'Shows all professionals',
    parameters: [
      {
        in: 'query',
        name: 'specialtyId',
        schema: {
          type: 'string',
        },
        required: false,
        description: 'Defines professional specialty to filter professionals',
      },
      {
        in: 'query',
        name: 'typeId',
        schema: {
          type: 'string',
        },
        required: false,
        description: 'Defines professional type to filter professionals',
      },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/schemas/professional',
              },
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
  post: {
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: ['Professionals'],
    summary: 'Creates a professional',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/createProfessional',
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
              $ref: '#/schemas/professional',
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
  specialties: {
    get: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Professionals'],
      summary: 'Show all specialties',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  group: {
                    type: 'string',
                  },
                  specialties: {
                    type: 'array',
                    items: {
                      $ref: '#/schemas/specialty',
                    },
                  },
                },
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
