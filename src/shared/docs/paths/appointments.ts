export const appointmentsPath = {
  post: {
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: ['Appointments'],
    summary: 'Create a new appointment',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/createAppointment',
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
              $ref: '#/schemas/appointment',
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
  get: {
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: ['Appointments'],
    summary: 'Show all appointments',
    parameters: [
      {
        in: 'query',
        name: 'withoutProfessional',
        schema: {
          type: 'boolean',
        },
        required: false,
        description:
          'Defines filter of appointments without professional (default: false)',
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
                $ref: '#/schemas/appointment',
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
  withId: {
    get: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Appointments'],
      summary: 'Show appointment infos',
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Appointment UUID',
        },
      ],
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                $ref: '#/schemas/appointment',
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
  slots: {
    get: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Appointments'],
      summary: 'Show slots by type or specialty id',
      parameters: [
        {
          in: 'path',
          name: 'uuid',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Professional type or specialty UUID',
        },
        {
          in: 'query',
          name: 'filterBy',
          schema: {
            type: 'string',
            enum: ['type', 'specialty'],
          },
          required: false,
          description:
            'Defines if slots will be filtered by type or specialty (default: specialty)',
        },
        {
          in: 'query',
          name: 'days',
          schema: {
            type: 'integer',
          },
          required: false,
          description: 'Defines number of returned days (default: 3)',
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
                  $ref: '#/schemas/slot',
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
  prices: {
    get: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Appointments'],
      summary: 'Show appointment price based on type and specialty',
      parameters: [
        {
          in: 'path',
          name: 'typeId',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Professional type UUID',
        },
        {
          in: 'path',
          name: 'specialtyId',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Professional specialty UUID',
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
                  $ref: '#/schemas/price',
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
  professionals: {
    get: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Appointments'],
      summary: 'Show appointments by professional id',
      parameters: [
        {
          in: 'path',
          name: 'professionalId',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Professional UUID',
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
                  $ref: '#/schemas/appointment',
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
