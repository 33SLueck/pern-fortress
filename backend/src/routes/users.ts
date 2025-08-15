import type { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateCreateUsers,
  validateGetUsersById,
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

// GET /api/users
export const getUsersHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        take: Math.min(limit, 100),
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

getUsersHandler.apiDoc = {
  summary: 'Get all users',
  description: 'Retrieve a list of all users from the database',
  operationId: 'getUsers',
  tags: ['Users'],
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
      description: 'Maximum number of users to return',
    },
    {
      in: 'query',
      name: 'offset',
      schema: {
        type: 'integer',
        minimum: 0,
        default: 0,
      },
      description: 'Number of users to skip',
    },
  ],
  responses: {
    '200': {
      description: 'List of users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              users: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    email: { type: 'string', example: 'user@example.com' },
                    name: { type: 'string', example: 'John Doe' },
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
              error: { type: 'string', example: 'Failed to fetch users' },
              status: { type: 'integer', example: 500 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
};

// GET /api/users/:id
export const getUserByIdHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: 'Invalid user ID',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({
        error: 'User not found',
        status: 404,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

getUserByIdHandler.apiDoc = {
  summary: 'Get user by ID',
  description: 'Retrieve a specific user by their ID',
  operationId: 'getUserById',
  tags: ['Users'],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: { type: 'integer' },
      description: 'User ID',
    },
  ],
  responses: {
    '200': {
      description: 'User found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              email: { type: 'string', example: 'user@example.com' },
              name: { type: 'string', example: 'John Doe' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    '400': {
      description: 'Invalid user ID',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Invalid user ID' },
              status: { type: 'integer', example: 400 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    '404': {
      description: 'User not found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'User not found' },
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
              error: { type: 'string', example: 'Failed to fetch user' },
              status: { type: 'integer', example: 500 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
};

// POST /api/users
export const createUserHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, name } = req.body;

    if (!email) {
      res.status(400).json({
        error: 'Email is required',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
      },
    });

    res.status(201).json(user);
  } catch (error: unknown) {
    console.error('Error creating user:', error);

    // Check if it's a Prisma error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      res.status(400).json({
        error: 'Email already exists',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to create user',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

createUserHandler.apiDoc = {
  summary: 'Create a new user',
  description: 'Create a new user in the database',
  operationId: 'createUser',
  tags: ['Users'],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            name: { type: 'string', example: 'John Doe' },
          },
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              email: { type: 'string', example: 'user@example.com' },
              name: { type: 'string', example: 'John Doe' },
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
              error: { type: 'string', example: 'Email is required' },
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
              error: { type: 'string', example: 'Failed to create user' },
              status: { type: 'integer', example: 500 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
};

router.get('/', validatePagination, handleValidationErrors, getUsersHandler);
router.get(
  '/:id',
  validateGetUsersById,
  handleValidationErrors,
  getUserByIdHandler
);
router.post(
  '/',
  validateCreateUsers,
  handleValidationErrors,
  createUserHandler
);

export default router;
