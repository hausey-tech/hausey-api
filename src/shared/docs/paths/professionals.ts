export const professionalsPath = {
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
