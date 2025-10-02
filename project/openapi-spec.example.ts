import type { OpenAPIObject } from 'npm:openapi3-ts@4.1.2';

export const openApiSpec: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'Your API',
    version: '1.0.0',
    description: 'Comprehensive API documentation for your Supabase-powered application',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
      url: 'https://example.com/support'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'https://{project-id}.supabase.co/functions/v1',
      description: 'Production server',
      variables: {
        'project-id': {
          default: 'your-project-id',
          description: 'Your Supabase project ID'
        }
      }
    },
    {
      url: 'http://localhost:54321/functions/v1',
      description: 'Local development server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from Supabase authentication'
      },
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'apikey',
        description: 'Supabase anonymous or service role key'
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'email', 'created_at'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the user',
            example: '550e8400-e29b-41d4-a716-446655440000'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'user@example.com'
          },
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            description: 'User full name',
            example: 'John Doe'
          },
          bio: {
            type: 'string',
            maxLength: 500,
            nullable: true,
            description: 'User biography',
            example: 'Software developer and open source enthusiast'
          },
          avatar_url: {
            type: 'string',
            format: 'uri',
            nullable: true,
            description: 'URL to user avatar image',
            example: 'https://example.com/avatars/user.jpg'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the user was created',
            example: '2024-01-15T10:30:00Z'
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the user was last updated',
            example: '2024-01-20T14:45:00Z'
          }
        }
      },
      UserCreate: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'newuser@example.com'
          },
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            description: 'User full name',
            example: 'Jane Smith'
          },
          password: {
            type: 'string',
            minLength: 8,
            format: 'password',
            description: 'User password (minimum 8 characters)',
            example: 'SecurePass123!'
          },
          bio: {
            type: 'string',
            maxLength: 500,
            description: 'User biography',
            example: 'Designer and developer'
          }
        }
      },
      UserUpdate: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            description: 'User full name',
            example: 'John Updated Doe'
          },
          bio: {
            type: 'string',
            maxLength: 500,
            description: 'User biography',
            example: 'Senior software developer'
          },
          avatar_url: {
            type: 'string',
            format: 'uri',
            description: 'URL to user avatar image',
            example: 'https://example.com/avatars/updated.jpg'
          }
        }
      },
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            minimum: 1,
            description: 'Current page number',
            example: 1
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Items per page',
            example: 20
          },
          total_items: {
            type: 'integer',
            minimum: 0,
            description: 'Total number of items',
            example: 150
          },
          total_pages: {
            type: 'integer',
            minimum: 0,
            description: 'Total number of pages',
            example: 8
          },
          has_next: {
            type: 'boolean',
            description: 'Whether there is a next page',
            example: true
          },
          has_prev: {
            type: 'boolean',
            description: 'Whether there is a previous page',
            example: false
          }
        }
      },
      UserListResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/User'
            }
          },
          pagination: {
            $ref: '#/components/schemas/Pagination'
          }
        }
      },
      UserResponse: {
        type: 'object',
        properties: {
          data: {
            $ref: '#/components/schemas/User'
          }
        }
      },
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: {
                type: 'string',
                description: 'Machine-readable error code',
                example: 'VALIDATION_ERROR',
                enum: [
                  'INVALID_REQUEST',
                  'UNAUTHORIZED',
                  'FORBIDDEN',
                  'NOT_FOUND',
                  'CONFLICT',
                  'VALIDATION_ERROR',
                  'RATE_LIMIT_EXCEEDED',
                  'INTERNAL_ERROR'
                ]
              },
              message: {
                type: 'string',
                description: 'Human-readable error message',
                example: 'Validation failed'
              },
              details: {
                type: 'object',
                additionalProperties: true,
                description: 'Additional error context',
                example: {
                  email: 'Email is already registered',
                  password: 'Password must be at least 8 characters'
                }
              }
            }
          }
        }
      }
    },
    parameters: {
      PageParam: {
        name: 'page',
        in: 'query',
        description: 'Page number (1-indexed)',
        required: false,
        schema: {
          type: 'integer',
          minimum: 1,
          default: 1
        }
      },
      LimitParam: {
        name: 'limit',
        in: 'query',
        description: 'Items per page',
        required: false,
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 20
        }
      },
      SortByParam: {
        name: 'sort_by',
        in: 'query',
        description: 'Field to sort by',
        required: false,
        schema: {
          type: 'string',
          default: 'created_at',
          enum: ['created_at', 'updated_at', 'name', 'email']
        }
      },
      OrderParam: {
        name: 'order',
        in: 'query',
        description: 'Sort order',
        required: false,
        schema: {
          type: 'string',
          default: 'desc',
          enum: ['asc', 'desc']
        }
      },
      SearchParam: {
        name: 'search',
        in: 'query',
        description: 'Search term for filtering',
        required: false,
        schema: {
          type: 'string'
        }
      },
      UserIdParam: {
        name: 'id',
        in: 'path',
        description: 'User unique identifier',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid'
        }
      }
    },
    responses: {
      Unauthorized: {
        description: 'Missing or invalid authentication token',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              error: {
                code: 'UNAUTHORIZED',
                message: 'Missing or invalid authentication token',
                details: {}
              }
            }
          }
        }
      },
      Forbidden: {
        description: 'Insufficient permissions',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              error: {
                code: 'FORBIDDEN',
                message: 'You do not have permission to access this resource',
                details: {}
              }
            }
          }
        }
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              error: {
                code: 'NOT_FOUND',
                message: 'User not found',
                details: {
                  user_id: '550e8400-e29b-41d4-a716-446655440000'
                }
              }
            }
          }
        }
      },
      ValidationError: {
        description: 'Input validation failed',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: {
                  email: 'Email is already registered',
                  password: 'Password must be at least 8 characters'
                }
              }
            }
          }
        }
      },
      RateLimitExceeded: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many requests. Please try again later.',
                details: {
                  retry_after: 60
                }
              }
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
            },
            example: {
              error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred. Please try again later.',
                details: {}
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/users': {
      get: {
        summary: 'Get all users',
        description: 'Retrieve a paginated list of users with optional filtering and sorting',
        operationId: 'getUsers',
        tags: ['Users'],
        security: [
          { BearerAuth: [] }
        ],
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/SortByParam' },
          { $ref: '#/components/parameters/OrderParam' },
          { $ref: '#/components/parameters/SearchParam' }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserListResponse'
                }
              }
            }
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '429': {
            $ref: '#/components/responses/RateLimitExceeded'
          },
          '500': {
            $ref: '#/components/responses/InternalError'
          }
        }
      },
      post: {
        summary: 'Create a user',
        description: 'Create a new user account',
        operationId: 'createUser',
        tags: ['Users'],
        security: [
          { ApiKeyAuth: [] }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserCreate'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse'
                }
              }
            }
          },
          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '409': {
            description: 'User already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  error: {
                    code: 'CONFLICT',
                    message: 'User with this email already exists',
                    details: {
                      email: 'user@example.com'
                    }
                  }
                }
              }
            }
          },
          '422': {
            $ref: '#/components/responses/ValidationError'
          },
          '500': {
            $ref: '#/components/responses/InternalError'
          }
        }
      }
    },
    '/users/{id}': {
      get: {
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their unique identifier',
        operationId: 'getUserById',
        tags: ['Users'],
        security: [
          { BearerAuth: [] }
        ],
        parameters: [
          { $ref: '#/components/parameters/UserIdParam' }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse'
                }
              }
            }
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '404': {
            $ref: '#/components/responses/NotFound'
          },
          '500': {
            $ref: '#/components/responses/InternalError'
          }
        }
      },
      put: {
        summary: 'Update user',
        description: 'Update an existing user information',
        operationId: 'updateUser',
        tags: ['Users'],
        security: [
          { BearerAuth: [] }
        ],
        parameters: [
          { $ref: '#/components/parameters/UserIdParam' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserUpdate'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse'
                }
              }
            }
          },
          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '403': {
            $ref: '#/components/responses/Forbidden'
          },
          '404': {
            $ref: '#/components/responses/NotFound'
          },
          '422': {
            $ref: '#/components/responses/ValidationError'
          },
          '500': {
            $ref: '#/components/responses/InternalError'
          }
        }
      },
      delete: {
        summary: 'Delete user',
        description: 'Delete a user account permanently',
        operationId: 'deleteUser',
        tags: ['Users'],
        security: [
          { ApiKeyAuth: [] }
        ],
        parameters: [
          { $ref: '#/components/parameters/UserIdParam' }
        ],
        responses: {
          '204': {
            description: 'User deleted successfully'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '403': {
            $ref: '#/components/responses/Forbidden'
          },
          '404': {
            $ref: '#/components/responses/NotFound'
          },
          '500': {
            $ref: '#/components/responses/InternalError'
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Users',
      description: 'User management endpoints'
    }
  ]
};
