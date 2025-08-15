import type { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateCreateProducts,
  validateGetProductsById,
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

// GET /api/v1/products
export const getProductsHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        take: Math.min(limit, 100),
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ]);

    res.json({
      products,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

getProductsHandler.apiDoc = {
  summary: 'Get all products',
  description: 'Retrieve a list of all products from the database',
  operationId: 'getProducts',
  tags: ['Products'],
  parameters: [
    {
      in: 'query',
      name: 'limit',
      schema: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10,
      },
      description: 'Maximum number of products to return',
    },
    {
      in: 'query',
      name: 'offset',
      schema: {
        type: 'integer',
        minimum: 0,
        default: 0,
      },
      description: 'Number of products to skip',
    },
  ],
  responses: {
    '200': {
      description: 'List of products',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Products Name' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
              total: { type: 'integer', example: 42 },
              limit: { type: 'integer', example: 10 },
              offset: { type: 'integer', example: 0 },
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
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Failed to fetch products' },
              status: { type: 'integer', example: 500 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
};

// GET /api/v1/products/:id
export const getProductsByIdHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: 'Invalid products ID',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const products = await prisma.product.findUnique({
      where: { id },
    });

    if (!products) {
      res.status(404).json({
        error: 'Products not found',
        status: 404,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

getProductsByIdHandler.apiDoc = {
  summary: 'Get products by ID',
  description: 'Retrieve a specific products by their ID',
  operationId: 'getProductsById',
  tags: ['Products'],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: { type: 'integer' },
      description: 'Products ID',
    },
  ],
  responses: {
    '200': {
      description: 'Products found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Products Name' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    '400': {
      description: 'Invalid products ID',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Invalid products ID' },
              status: { type: 'integer', example: 400 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    '404': {
      description: 'Products not found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Products not found' },
              status: { type: 'integer', example: 404 },
              timestamp: { type: 'string', format: 'date-time' },
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
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Failed to fetch products' },
              status: { type: 'integer', example: 500 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
};

// POST /api/v1/products
export const createProductsHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        error: 'Name is required',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const products = await prisma.product.create({
      data: {
        name,
      },
    });

    res.status(201).json(products);
  } catch (error: unknown) {
    console.error('Error creating products:', error);

    // Check if it's a Prisma error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      res.status(400).json({
        error: 'Name already exists',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to create products',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

createProductsHandler.apiDoc = {
  summary: 'Create a new products',
  description: 'Create a new products in the database',
  operationId: 'createProducts',
  tags: ['Products'],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Products Name',
            },
          },
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'Products created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Products Name' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    '400': {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Name is required' },
              status: { type: 'integer', example: 400 },
              timestamp: { type: 'string', format: 'date-time' },
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
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Failed to create products' },
              status: { type: 'integer', example: 500 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
};

router.get('/', validatePagination, handleValidationErrors, getProductsHandler);
router.get(
  '/:id',
  validateGetProductsById,
  handleValidationErrors,
  getProductsByIdHandler
);
router.post(
  '/',
  validateCreateProducts,
  handleValidationErrors,
  createProductsHandler
);

export default router;
