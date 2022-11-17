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
  },
};
