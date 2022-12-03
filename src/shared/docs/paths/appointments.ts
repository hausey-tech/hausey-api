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
  slots: {
    byTypeId: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Appointments'],
      summary: 'Show slots by type id',
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
    bySpecialtyId: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Appointments'],
      summary: 'Show slots by specialty id',
      parameters: [
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
};
