export const integrationsPath = {
  twilio: {
    post: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: ['Integrations'],
      summary: 'Creates a twilio room',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                identity: {
                  type: 'string',
                },
                room: {
                  type: 'string',
                },
              },
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
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
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
