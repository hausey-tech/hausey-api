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
    summary: 'Create a new user and professional',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/createUserAndProfessional',
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
  types: {
    get: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Professionals'],
      summary: 'Show all types',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/schemas/professionalType',
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
                type: 'array',
                items: {
                  $ref: '#/schemas/specialty',
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
    byTypeId: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Professionals'],
      summary: 'Show specialties by professional type',
      parameters: [
        {
          in: 'path',
          name: 'typeId',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'UUID of the professional type',
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
                  $ref: '#/schemas/specialty',
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
