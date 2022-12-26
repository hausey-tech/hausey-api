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
  memed: {
    users: {
      get: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Integrations'],
        summary: 'Searches a memed user by memed token',
        parameters: [
          {
            in: 'path',
            name: 'token',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'Memed user token',
          },
        ],
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/schemas/memedUser',
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
    prescriptions: {
      users: {
        get: {
          security: [
            {
              bearerAuth: [],
            },
          ],
          tags: ['Integrations'],
          summary: 'Searches a memed user by external id',
          parameters: [
            {
              in: 'path',
              name: 'token',
              schema: {
                type: 'string',
              },
              required: true,
              description: 'External id (professional id)',
            },
          ],
          responses: {
            200: {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/schemas/memedUser',
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
          tags: ['Integrations'],
          summary: 'Creates a memed user *only api to api use',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/schemas/createMemedUser',
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
                    $ref: '#/schemas/memedUser',
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
  },
  s3: {
    get: {
      // security: [
      //   {
      //     bearerAuth: [],
      //   },
      // ],
      tags: ['Integrations'],
      summary: 'Shows a file from S3',
      parameters: [
        {
          in: 'path',
          name: 'key',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Key of the file in the S3 bucket',
        },
      ],
      responses: {
        200: {
          description: 'Success',
          content: {
            'image/*': {},
            'application/pdf': {},
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
