import swaggerJSDoc from 'swagger-jsdoc';
import config from '#config/index';

/**
 * Swagger/OpenAPI configuration
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node Express Starter API',
    version: '1.0.0',
    description: 'A production-ready Node.js/Express boilerplate API documentation',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    },
    contact: {
      name: 'API Support'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/v1`,
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints'
    },
    {
      name: 'Users',
      description: 'User management endpoints'
    }
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'User ID',
            example: '507f1f77bcf86cd799439011'
          },
          name: {
            type: 'string',
            description: 'User name',
            example: 'John Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john@example.com'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: 'User role',
            example: 'user'
          },
          active: {
            type: 'boolean',
            description: 'Whether user is active',
            example: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      CreateUserInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'User name',
            example: 'John Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john@example.com'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: 'User role (optional)',
            example: 'user'
          }
        }
      },
      UpdateUserInput: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'User name',
            example: 'Jane Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'jane@example.com'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: 'User role'
          },
          active: {
            type: 'boolean',
            description: 'Whether user is active'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'fail'
          },
          message: {
            type: 'string',
            example: 'Error message'
          },
          correlationId: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000'
          }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success'
          },
          message: {
            type: 'string',
            example: 'Operation successful'
          },
          data: {
            type: 'object'
          }
        }
      }
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/docs/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
