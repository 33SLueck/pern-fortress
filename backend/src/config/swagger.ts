import { SwaggerDefinition } from 'swagger-jsdoc';

// Add proper type definitions at the top
interface OpenAPIParameter {
  name: string;
  in: string;
  required?: boolean;
  schema: Record<string, unknown>;
  description?: string;
}

interface OpenAPIResponse {
  description: string;
  content?: {
    'application/json': {
      schema: Record<string, unknown>; // Made more flexible
    };
  };
}

interface OpenAPIOperation {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: {
    required?: boolean;
    content: {
      'application/json': {
        schema: Record<string, unknown>; // Made more flexible
      };
    };
  };
  responses: Record<string, OpenAPIResponse>;
  security?: Array<Record<string, string[]>>;
}

interface OpenAPIPaths {
  [path: string]: {
    get?: OpenAPIOperation;
    post?: OpenAPIOperation;
    put?: OpenAPIOperation;
    delete?: OpenAPIOperation;
    patch?: OpenAPIOperation;
  };
}

// Import only the route handlers we want to keep
import { welcomeHandler, apiInfoHandler } from '../routes/info';
import { healthCheckHandler } from '../routes/health';
import {
  getUsersHandler,
  getUserByIdHandler,
  createUserHandler,
} from '../routes/users';
import {
  getProductsHandler,
  getProductsByIdHandler,
  createProductsHandler,
} from '../routes/products';
import {
  getBookHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
} from '../routes/book';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PERN Fortress API',
    version: '1.0.0',
    description:
      'A comprehensive PERN Stack API with PostgreSQL, Express, React, and Node.js',
    contact: {
      name: '33SLueck',
      email: 'your-email@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Info',
      description: 'Application information',
    },
    {
      name: 'Users',
      description: 'User management operations',
    },
    {
      name: 'Products',
      description: 'Product management operations',
    },
    {
      name: 'Book',
      description: 'Book management operations',
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the user',
            example: 1,
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'user@example.com',
          },
          name: {
            type: 'string',
            description: 'User full name',
            example: 'John Doe',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the user was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the user was last updated',
          },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: 'User full name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john@example.com',
          },
        },
      },
      Product: {
        type: 'object',
        required: ['id', 'name', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the product',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'Product name',
            example: 'Sample Product',
          },
          description: {
            type: 'string',
            description: 'Product description',
            example: 'A sample product description',
            nullable: true,
          },
          price: {
            type: 'number',
            format: 'float',
            description: 'Product price',
            example: 19.99,
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the product was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the product was last updated',
          },
        },
      },
      CreateProductRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: 'Product name',
            example: 'New Product',
          },
          description: {
            type: 'string',
            description: 'Product description',
            example: 'A new product description',
          },
          price: {
            type: 'number',
            format: 'float',
            minimum: 0,
            description: 'Product price',
            example: 29.99,
          },
        },
      },
      Error: {
        type: 'object',
        required: ['error', 'status', 'timestamp'],
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
            },
            description: 'Detailed error information',
          },
          status: {
            type: 'integer',
            description: 'HTTP status code',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Error timestamp',
          },
        },
      },
      HealthStatus: {
        type: 'object',
        required: ['status', 'timestamp'],
        properties: {
          status: {
            type: 'string',
            enum: ['healthy'],
            description: 'Application health status',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Health check timestamp',
          },
          uptime: {
            type: 'number',
            description: 'Application uptime in seconds',
          },
          version: {
            type: 'string',
            description: 'Application version',
          },
        },
      },
      ApiInfo: {
        type: 'object',
        required: ['name', 'version'],
        properties: {
          name: {
            type: 'string',
            description: 'API name',
          },
          version: {
            type: 'string',
            description: 'API version',
          },
          description: {
            type: 'string',
            description: 'API description',
          },
          environment: {
            type: 'string',
            description: 'Current environment',
          },
        },
      },
      Book: {
        type: 'object',
        required: ['id', 'name', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the book',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'Book name',
            example: 'Sample Book',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the book was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the book was last updated',
          },
        },
      },
      CreateBookRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: 'Book name',
            example: 'New Book',
          },
        },
      },
      UpdateBookRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: 'Book name',
            example: 'Updated Book',
          },
        },
      },
    },

    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      BadRequest: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};

// Function to extract and process paths from handler functions
function extractPathsFromHandlers(): OpenAPIPaths {
  const paths: OpenAPIPaths = {};

  // Health endpoints
  if (healthCheckHandler.apiDoc) {
    paths['/api/v1/health'] = {
      get: healthCheckHandler.apiDoc,
    };
  }

  // Info endpoints
  if (welcomeHandler.apiDoc) {
    paths['/'] = {
      get: welcomeHandler.apiDoc,
    };
  }

  if (apiInfoHandler.apiDoc) {
    paths['/api-info'] = {
      get: apiInfoHandler.apiDoc,
    };
  }

  // Users endpoints
  if (getUsersHandler.apiDoc || createUserHandler.apiDoc) {
    paths['/api/v1/users'] = {};
    if (getUsersHandler.apiDoc) {
      paths['/api/v1/users'].get = getUsersHandler.apiDoc;
    }
    if (createUserHandler.apiDoc) {
      paths['/api/v1/users'].post = createUserHandler.apiDoc;
    }
  }

  if (getUserByIdHandler.apiDoc) {
    paths['/api/v1/users/{id}'] = {
      get: getUserByIdHandler.apiDoc,
    };
  }

  // Products endpoints
  if (getProductsHandler.apiDoc || createProductsHandler.apiDoc) {
    paths['/api/v1/products'] = {};
    if (getProductsHandler.apiDoc) {
      paths['/api/v1/products'].get = getProductsHandler.apiDoc;
    }
    if (createProductsHandler.apiDoc) {
      paths['/api/v1/products'].post = createProductsHandler.apiDoc;
    }
  }

  if (getProductsByIdHandler.apiDoc) {
    paths['/api/v1/products/{id}'] = {
      get: getProductsByIdHandler.apiDoc,
    };
  }

  // Book endpoints
  if (getBookHandler.apiDoc || createBookHandler.apiDoc) {
    paths['/api/v1/book'] = {};
    if (getBookHandler.apiDoc) {
      paths['/api/v1/book'].get = getBookHandler.apiDoc;
    }
    if (createBookHandler.apiDoc) {
      paths['/api/v1/book'].post = createBookHandler.apiDoc;
    }
  }

  if (
    getBookByIdHandler.apiDoc ||
    updateBookHandler.apiDoc ||
    deleteBookHandler.apiDoc
  ) {
    paths['/api/v1/book/{id}'] = {};
    if (getBookByIdHandler.apiDoc) {
      paths['/api/v1/book/{id}'].get = getBookByIdHandler.apiDoc;
    }
    if (updateBookHandler.apiDoc) {
      paths['/api/v1/book/{id}'].put = updateBookHandler.apiDoc;
    }
    if (deleteBookHandler.apiDoc) {
      paths['/api/v1/book/{id}'].delete = deleteBookHandler.apiDoc;
    }
  }

  return paths;
}

// Create the complete OpenAPI specification
const swaggerSpec = {
  ...swaggerDefinition,
  paths: extractPathsFromHandlers(),
};

export default swaggerSpec;
