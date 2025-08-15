import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Handlebars from 'handlebars';
import { generateModel } from './model';

export interface RouteOptions {
  path?: string;
  methods?: string;
  validation?: boolean;
  tests?: boolean;
  swagger?: boolean;
}

// Register Handlebars helpers
Handlebars.registerHelper('eq', function (a: unknown, b: unknown) {
  return a === b;
});

Handlebars.registerHelper('includes', function (array: string[], value: string) {
  return array.includes(value);
});

// Helper functions
function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toKebabCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function toSnakeCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '_');
}

const fullCrudRouteTemplate = `import type { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateCreate{{pascalName}},
  validateUpdate{{pascalName}},
  validateGet{{pascalName}}ById,
  validatePagination,
  handleValidationErrors,
} from '../middleware/validation/';

const router = Router();
const prisma = new PrismaClient();

interface OpenApiResponse {
  description: string;
  content?: {
    'application/json': {
      schema: Record<string, unknown>;
    };
  };
}

interface RouteHandler {
  (req: Request, res: Response): Promise<void>;
  apiDoc?: {
    summary: string;
    description: string;
    operationId: string;
    tags: string[];
    parameters?: Array<{
      in: string;
      name: string;
      required?: boolean;
      schema: Record<string, unknown>;
      description: string;
    }>;
    requestBody?: {
      required: boolean;
      content: {
        'application/json': {
          schema: Record<string, unknown>;
        };
      };
    };
    responses: Record<string, OpenApiResponse>;
  };
}

// GET /{{kebabName}} - Get all {{lowerName}}
export const get{{pascalName}}Handler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const {{lowerName}} = await prisma.{{lowerName}}.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.{{lowerName}}.count();

    res.json({
      data: {{lowerName}},
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching {{lowerName}}:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch {{lowerName}}',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

get{{pascalName}}Handler.apiDoc = {
  summary: 'Get all {{lowerName}}',
  description: 'Retrieve a paginated list of {{lowerName}}',
  operationId: 'get{{pascalName}}',
  tags: ['{{pascalName}}'],
  parameters: [
    {
      in: 'query',
      name: 'limit',
      required: false,
      schema: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10,
      },
      description: 'Number of items to return',
    },
    {
      in: 'query',
      name: 'offset',
      required: false,
      schema: {
        type: 'integer',
        minimum: 0,
        default: 0,
      },
      description: 'Number of items to skip',
    },
  ],
  responses: {
    '200': {
      description: 'Successfully retrieved {{lowerName}}',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/{{pascalName}}',
                },
              },
              pagination: {
                type: 'object',
                properties: {
                  total: { type: 'integer' },
                  limit: { type: 'integer' },
                  offset: { type: 'integer' },
                  hasMore: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    },
    '500': {
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
};

// GET /{{kebabName}}/:id - Get {{lowerName}} by ID
export const get{{pascalName}}ByIdHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: 'Invalid ID',
        message: 'ID must be a valid number',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const {{lowerName}} = await prisma.{{lowerName}}.findUnique({
      where: { id },
    });

    if (!{{lowerName}}) {
      res.status(404).json({
        error: 'Not found',
        message: '{{pascalName}} not found',
        status: 404,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json({{lowerName}});
  } catch (error) {
    console.error('Error fetching {{lowerName}}:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch {{lowerName}}',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

get{{pascalName}}ByIdHandler.apiDoc = {
  summary: 'Get {{lowerName}} by ID',
  description: 'Retrieve a specific {{lowerName}} by its ID',
  operationId: 'get{{pascalName}}ById',
  tags: ['{{pascalName}}'],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'integer',
        minimum: 1,
      },
      description: '{{pascalName}} ID',
    },
  ],
  responses: {
    '200': {
      description: 'Successfully retrieved {{lowerName}}',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/{{pascalName}}',
          },
        },
      },
    },
    '400': {
      description: 'Invalid ID',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error',
          },
        },
      },
    },
    '404': {
      description: '{{pascalName}} not found',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error',
          },
        },
      },
    },
    '500': {
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
};

// POST /{{kebabName}} - Create new {{lowerName}}
export const create{{pascalName}}Handler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {{lowerName}} = await prisma.{{lowerName}}.create({
      data: req.body,
    });

    res.status(201).json({{lowerName}});
  } catch (error) {
    console.error('Error creating {{lowerName}}:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create {{lowerName}}',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

create{{pascalName}}Handler.apiDoc = {
  summary: 'Create new {{lowerName}}',
  description: 'Create a new {{lowerName}}',
  operationId: 'create{{pascalName}}',
  tags: ['{{pascalName}}'],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Create{{pascalName}}Request',
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'Successfully created {{lowerName}}',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/{{pascalName}}',
          },
        },
      },
    },
    '400': {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error',
          },
        },
      },
    },
    '500': {
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
};

// PUT /{{kebabName}}/:id - Update {{lowerName}}
export const update{{pascalName}}Handler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: 'Invalid ID',
        message: 'ID must be a valid number',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Check if {{lowerName}} exists
    const existing{{pascalName}} = await prisma.{{lowerName}}.findUnique({
      where: { id },
    });

    if (!existing{{pascalName}}) {
      res.status(404).json({
        error: 'Not found',
        message: '{{pascalName}} not found',
        status: 404,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const {{lowerName}} = await prisma.{{lowerName}}.update({
      where: { id },
      data: req.body,
    });

    res.json({{lowerName}});
  } catch (error) {
    console.error('Error updating {{lowerName}}:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update {{lowerName}}',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

update{{pascalName}}Handler.apiDoc = {
  summary: 'Update {{lowerName}}',
  description: 'Update an existing {{lowerName}}',
  operationId: 'update{{pascalName}}',
  tags: ['{{pascalName}}'],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'integer',
        minimum: 1,
      },
      description: '{{pascalName}} ID',
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Update{{pascalName}}Request',
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Successfully updated {{lowerName}}',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/{{pascalName}}',
          },
        },
      },
    },
    '400': {
      description: 'Invalid ID or validation error',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error',
          },
        },
      },
    },
    '404': {
      description: '{{pascalName}} not found',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error',
          },
        },
      },
    },
    '500': {
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
};

// DELETE /{{kebabName}}/:id - Delete {{lowerName}}
export const delete{{pascalName}}Handler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: 'Invalid ID',
        message: 'ID must be a valid number',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Check if {{lowerName}} exists
    const existing{{pascalName}} = await prisma.{{lowerName}}.findUnique({
      where: { id },
    });

    if (!existing{{pascalName}}) {
      res.status(404).json({
        error: 'Not found',
        message: '{{pascalName}} not found',
        status: 404,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    await prisma.{{lowerName}}.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting {{lowerName}}:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete {{lowerName}}',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

delete{{pascalName}}Handler.apiDoc = {
  summary: 'Delete {{lowerName}}',
  description: 'Delete an existing {{lowerName}}',
  operationId: 'delete{{pascalName}}',
  tags: ['{{pascalName}}'],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'integer',
        minimum: 1,
      },
      description: '{{pascalName}} ID',
    },
  ],
  responses: {
    '204': {
      description: 'Successfully deleted {{lowerName}}',
    },
    '400': {
      description: 'Invalid ID',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error',
          },
        },
      },
    },
    '404': {
      description: '{{pascalName}} not found',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error',
          },
        },
      },
    },
    '500': {
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
};

// Routes
router.get('/', validatePagination, handleValidationErrors, get{{pascalName}}Handler);
router.get('/:id', validateGet{{pascalName}}ById, handleValidationErrors, get{{pascalName}}ByIdHandler);
router.post('/', validateCreate{{pascalName}}, handleValidationErrors, create{{pascalName}}Handler);
router.put('/:id', validateUpdate{{pascalName}}, handleValidationErrors, update{{pascalName}}Handler);
router.delete('/:id', validateGet{{pascalName}}ById, handleValidationErrors, delete{{pascalName}}Handler);

export default router;
`;

const validationTemplate = `import { body, param } from 'express-validator';

// Validation for creating {{lowerName}}
export const validateCreate{{pascalName}} = [
  body('name')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
  // Add more validation rules as needed based on your model
];

// Validation for updating {{lowerName}}
export const validateUpdate{{pascalName}} = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  body('name')
    .optional()
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
  // Add more validation rules as needed based on your model
];

// Validation for getting {{lowerName}} by ID
export const validateGet{{pascalName}}ById = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
];
`;

const testTemplate = `import request from 'supertest';
import app from '../../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('{{pascalName}} Routes', () => {
  beforeAll(async () => {
    // Setup test database
  });

  afterAll(async () => {
    // Cleanup test database
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
  });

  describe('GET /api/v1/{{kebabName}}', () => {
    it('should return a list of {{lowerName}}', async () => {
      const response = await request(app)
        .get('/api/v1/{{kebabName}}')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/{{kebabName}}?limit=5&offset=0')
        .expect(200);

      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.offset).toBe(0);
    });
  });

  describe('GET /api/v1/{{kebabName}}/:id', () => {
    it('should return a {{lowerName}} by ID', async () => {
      // Create a test {{lowerName}} first
      const created{{pascalName}} = await prisma.{{lowerName}}.create({
        data: {
          name: 'Test {{pascalName}}',
        },
      });

      const response = await request(app)
        .get('/api/v1/{{kebabName}}/' + created{{pascalName}}.id)
        .expect(200);

      expect(response.body.id).toBe(created{{pascalName}}.id);
      expect(response.body.name).toBe('Test {{pascalName}}');
    });

    it('should return 404 for non-existent {{lowerName}}', async () => {
      await request(app)
        .get('/api/v1/{{kebabName}}/99999')
        .expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app)
        .get('/api/v1/{{kebabName}}/invalid')
        .expect(400);
    });
  });

  describe('POST /api/v1/{{kebabName}}', () => {
    it('should create a new {{lowerName}}', async () => {
      const {{lowerName}}Data = {
        name: 'New {{pascalName}}',
      };

      const response = await request(app)
        .post('/api/v1/{{kebabName}}')
        .send({{lowerName}}Data)
        .expect(201);

      expect(response.body.name).toBe({{lowerName}}Data.name);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        name: '', // Empty name should fail validation
      };

      await request(app)
        .post('/api/v1/{{kebabName}}')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('PUT /api/v1/{{kebabName}}/:id', () => {
    it('should update an existing {{lowerName}}', async () => {
      // Create a test {{lowerName}} first
      const created{{pascalName}} = await prisma.{{lowerName}}.create({
        data: {
          name: 'Original {{pascalName}}',
        },
      });

      const updateData = {
        name: 'Updated {{pascalName}}',
      };

      const response = await request(app)
        .put('/api/v1/{{kebabName}}/' + created{{pascalName}}.id)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.id).toBe(created{{pascalName}}.id);
    });

    it('should return 404 for non-existent {{lowerName}}', async () => {
      const updateData = { name: 'Updated {{pascalName}}' };

      await request(app)
        .put('/api/v1/{{kebabName}}/99999')
        .send(updateData)
        .expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      const updateData = { name: 'Updated {{pascalName}}' };

      await request(app)
        .put('/api/v1/{{kebabName}}/invalid')
        .send(updateData)
        .expect(400);
    });
  });

  describe('DELETE /api/v1/{{kebabName}}/:id', () => {
    it('should delete an existing {{lowerName}}', async () => {
      // Create a test {{lowerName}} first
      const created{{pascalName}} = await prisma.{{lowerName}}.create({
        data: {
          name: 'To Delete {{pascalName}}',
        },
      });

      await request(app)
        .delete('/api/v1/{{kebabName}}/' + created{{pascalName}}.id)
        .expect(204);

      // Verify the {{lowerName}} was deleted
      const deleted{{pascalName}} = await prisma.{{lowerName}}.findUnique({
        where: { id: created{{pascalName}}.id },
      });

      expect(deleted{{pascalName}}).toBeNull();
    });

    it('should return 404 for non-existent {{lowerName}}', async () => {
      await request(app)
        .delete('/api/v1/{{kebabName}}/99999')
        .expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app)
        .delete('/api/v1/{{kebabName}}/invalid')
        .expect(400);
    });
  });
});
`;

// Function to update index.ts with new route
async function updateIndexFile(modelName: string, routePath: string): Promise<void> {
  const indexPath = path.join(process.cwd(), 'backend/src/index.ts');
  
  if (!fs.existsSync(indexPath)) {
    console.warn(chalk.yellow(`Warning: ${indexPath} not found. Skipping index update.`));
    return;
  }

  let content = await fs.readFile(indexPath, 'utf-8');
  const kebabName = toKebabCase(modelName);
  const lowerName = modelName.toLowerCase();
  
  // Add import statement
  const importLine = `import ${lowerName}Routes from './routes/${lowerName}';`;
  const importRegex = /import.*from.*routes.*;\s*$/gm;
  const lastImportMatch = [...content.matchAll(importRegex)].pop();
  
  if (lastImportMatch && !content.includes(importLine)) {
    const lastImportIndex = lastImportMatch.index! + lastImportMatch[0].length;
    content = content.slice(0, lastImportIndex) + '\n' + importLine + content.slice(lastImportIndex);
  }
  
  // Add route usage
  const routeLine = `app.use('/api/v1/${kebabName}', ${lowerName}Routes);`;
  const routeRegex = /app\.use\('\/api\/v1\/\w+',.*Routes\);\s*$/gm;
  const lastRouteMatch = [...content.matchAll(routeRegex)].pop();
  
  if (lastRouteMatch && !content.includes(routeLine)) {
    const lastRouteIndex = lastRouteMatch.index! + lastRouteMatch[0].length;
    content = content.slice(0, lastRouteIndex) + '\n' + routeLine + content.slice(lastRouteIndex);
  }
  
  await fs.writeFile(indexPath, content);
  console.log(chalk.green(`✓ Updated ${indexPath} with new route`));
}

// Function to update validation index
async function updateValidationIndex(modelName: string): Promise<void> {
  const validationIndexPath = path.join(process.cwd(), 'backend/src/middleware/validation/index.ts');
  
  if (!fs.existsSync(validationIndexPath)) {
    console.warn(chalk.yellow(`Warning: ${validationIndexPath} not found. Skipping validation index update.`));
    return;
  }

  let content = await fs.readFile(validationIndexPath, 'utf-8');
  const pascalName = toPascalCase(modelName);
  const lowerName = modelName.toLowerCase();
  
  // Add export statement
  const exportLines = `export {
  validateCreate${pascalName},
  validateUpdate${pascalName},
  validateGet${pascalName}ById,
} from './${lowerName}';`;
  
  if (!content.includes(`from './${lowerName}'`)) {
    // Find the last export statement and add after it
    const lastExportMatch = content.lastIndexOf('} from \'./');
    if (lastExportMatch !== -1) {
      const endOfLine = content.indexOf('\n', lastExportMatch);
      content = content.slice(0, endOfLine + 1) + exportLines + '\n' + content.slice(endOfLine + 1);
    } else {
      // If no exports found, add at the end
      content += '\n' + exportLines + '\n';
    }
    
    await fs.writeFile(validationIndexPath, content);
    console.log(chalk.green(`✓ Updated ${validationIndexPath} with new validation exports`));
  }
}

// Function to add routes to Swagger configuration
async function addRouteToSwagger(modelName: string): Promise<void> {
  const swaggerPath = path.join(process.cwd(), 'backend/src/config/swagger.ts');
  
  if (!fs.existsSync(swaggerPath)) {
    console.warn(chalk.yellow(`Warning: ${swaggerPath} not found. Skipping Swagger update.`));
    return;
  }

  let content = await fs.readFile(swaggerPath, 'utf-8');
  const pascalName = toPascalCase(modelName);
  const lowerName = modelName.toLowerCase();
  
  // Add import statement
  const importLine = `import {
  get${pascalName}Handler,
  get${pascalName}ByIdHandler,
  create${pascalName}Handler,
  update${pascalName}Handler,
  delete${pascalName}Handler,
} from '../routes/${lowerName}';`;
  
  if (!content.includes(`from '../routes/${lowerName}'`)) {
    // Find the last import and add after it
    const lastImportMatch = content.lastIndexOf('} from \'../routes/');
    if (lastImportMatch !== -1) {
      const endOfLine = content.indexOf('\n', lastImportMatch);
      content = content.slice(0, endOfLine + 1) + importLine + '\n' + content.slice(endOfLine + 1);
    }
  }
  
  // Add tag to tags array
  const tagDefinition = `    {
      name: '${pascalName}',
      description: '${pascalName} management operations',
    },`;
  
  if (!content.includes(`name: '${pascalName}'`)) {
    const tagsEndMatch = content.indexOf('],', content.indexOf('tags: ['));
    if (tagsEndMatch !== -1) {
      content = content.slice(0, tagsEndMatch) + tagDefinition + '\n  ' + content.slice(tagsEndMatch);
    }
  }
  
  // Add schema definitions (basic template - should be customized based on model)
  const schemaDefinitions = `      ${pascalName}: {
        type: 'object',
        required: ['id', 'name', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the ${lowerName}',
            example: 1,
          },
          name: {
            type: 'string',
            description: '${pascalName} name',
            example: 'Sample ${pascalName}',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the ${lowerName} was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the ${lowerName} was last updated',
          },
        },
      },
      Create${pascalName}Request: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: '${pascalName} name',
            example: 'New ${pascalName}',
          },
        },
      },
      Update${pascalName}Request: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: '${pascalName} name',
            example: 'Updated ${pascalName}',
          },
        },
      },`.replace(/\$\{lowerName\}/g, lowerName).replace(/\$\{pascalName\}/g, pascalName);
  
  if (!content.includes(`${pascalName}: {`)) {
    const schemasEndMatch = content.lastIndexOf('},', content.indexOf('responses: {'));
    if (schemasEndMatch !== -1) {
      content = content.slice(0, schemasEndMatch + 2) + '\n      ' + schemaDefinitions + '\n    ' + content.slice(schemasEndMatch + 2);
    }
  }
  
  // Add paths to extractPathsFromHandlers function
  const pathsCode = `
  // ${pascalName} endpoints
  if (get${pascalName}Handler.apiDoc || create${pascalName}Handler.apiDoc) {
    paths['/api/v1/${toKebabCase(modelName)}'] = {};
    if (get${pascalName}Handler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}'].get = get${pascalName}Handler.apiDoc;
    }
    if (create${pascalName}Handler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}'].post = create${pascalName}Handler.apiDoc;
    }
  }

  if (get${pascalName}ByIdHandler.apiDoc || update${pascalName}Handler.apiDoc || delete${pascalName}Handler.apiDoc) {
    paths['/api/v1/${toKebabCase(modelName)}/{id}'] = {};
    if (get${pascalName}ByIdHandler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}/{id}'].get = get${pascalName}ByIdHandler.apiDoc;
    }
    if (update${pascalName}Handler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}/{id}'].put = update${pascalName}Handler.apiDoc;
    }
    if (delete${pascalName}Handler.apiDoc) {
      paths['/api/v1/${toKebabCase(modelName)}/{id}'].delete = delete${pascalName}Handler.apiDoc;
    }
  }`;
  
  if (!content.includes(`// ${pascalName} endpoints`)) {
    const returnStatementsMatch = content.indexOf('return paths;');
    if (returnStatementsMatch !== -1) {
      content = content.slice(0, returnStatementsMatch) + pathsCode + '\n\n  ' + content.slice(returnStatementsMatch);
    }
  }
  
  await fs.writeFile(swaggerPath, content);
  console.log(chalk.green(`✓ Updated ${swaggerPath} with new ${pascalName} documentation`));
}

export async function generateRoute(
  modelName: string,
  options: RouteOptions = {}
): Promise<void> {
  try {
    console.log(chalk.blue(`🚀 Generating CRUD route for ${modelName}...`));

    // Validate model name
    if (!modelName || typeof modelName !== 'string') {
      throw new Error('Model name is required and must be a string');
    }

    // Ensure model exists in Prisma schema
    await generateModel(modelName);

    const pascalName = toPascalCase(modelName);
    const lowerName = modelName.toLowerCase();
    const kebabName = toKebabCase(modelName);

    // Prepare template data
    const templateData = {
      pascalName,
      lowerName,
      kebabName,
      methods: options.methods || 'GET,POST,PUT,DELETE',
    };

    // Create backend directories
    const backendDir = path.join(process.cwd(), 'backend');
    const routesDir = path.join(backendDir, 'src/routes');
    const validationDir = path.join(backendDir, 'src/middleware/validation');
    const testsDir = path.join(backendDir, 'src/__tests__/routes');

    await fs.ensureDir(routesDir);
    await fs.ensureDir(validationDir);
    
    if (options.tests !== false) {
      await fs.ensureDir(testsDir);
    }

    // Generate route file
    const routeTemplate = Handlebars.compile(fullCrudRouteTemplate);
    const routeContent = routeTemplate(templateData);
    const routeFilePath = path.join(routesDir, `${lowerName}.ts`);
    
    await fs.writeFile(routeFilePath, routeContent);
    console.log(chalk.green(`✓ Generated route file: ${routeFilePath}`));

    // Generate validation file
    if (options.validation !== false) {
      const validationTemplateCompiled = Handlebars.compile(validationTemplate);
      const validationContent = validationTemplateCompiled(templateData);
      const validationFilePath = path.join(validationDir, `${lowerName}.ts`);
      
      await fs.writeFile(validationFilePath, validationContent);
      console.log(chalk.green(`✓ Generated validation file: ${validationFilePath}`));
      
      // Update validation index
      await updateValidationIndex(modelName);
    }

    // Generate test file
    if (options.tests !== false) {
      const testTemplateCompiled = Handlebars.compile(testTemplate);
      const testContent = testTemplateCompiled(templateData);
      const testFilePath = path.join(testsDir, `${lowerName}.test.ts`);
      
      await fs.writeFile(testFilePath, testContent);
      console.log(chalk.green(`✓ Generated test file: ${testFilePath}`));
    }

    // Update main index.ts file
    await updateIndexFile(modelName, options.path || `/api/v1/${kebabName}`);

    // Update Swagger configuration
    if (options.swagger !== false) {
      await addRouteToSwagger(modelName);
    }

    console.log(chalk.green(`\n🎉 Successfully generated CRUD route for ${pascalName}!`));
    console.log(chalk.cyan(`\nGenerated files:`));
    console.log(chalk.gray(`  • Route: backend/src/routes/${lowerName}.ts`));
    if (options.validation !== false) {
      console.log(chalk.gray(`  • Validation: backend/src/middleware/validation/${lowerName}.ts`));
    }
    if (options.tests !== false) {
      console.log(chalk.gray(`  • Tests: backend/src/__tests__/routes/${lowerName}.test.ts`));
    }
    console.log(chalk.gray(`  • Updated: backend/src/index.ts`));
    console.log(chalk.gray(`  • Updated: backend/src/middleware/validation/index.ts`));
    if (options.swagger !== false) {
      console.log(chalk.gray(`  • Updated: backend/src/config/swagger.ts`));
    }
    
    console.log(chalk.cyan(`\nAvailable endpoints:`));
    console.log(chalk.gray(`  • GET    /api/v1/${kebabName}     - Get all ${lowerName}`));
    console.log(chalk.gray(`  • GET    /api/v1/${kebabName}/:id - Get ${lowerName} by ID`));
    console.log(chalk.gray(`  • POST   /api/v1/${kebabName}     - Create new ${lowerName}`));
    console.log(chalk.gray(`  • PUT    /api/v1/${kebabName}/:id - Update ${lowerName}`));
    console.log(chalk.gray(`  • DELETE /api/v1/${kebabName}/:id - Delete ${lowerName}`));

  } catch (error) {
    console.error(chalk.red(`❌ Error generating route:`), error);
    throw error;
  }
}
