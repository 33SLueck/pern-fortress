import type { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateCreateBook,
  validateUpdateBook,
  validateGetBookById,
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

// GET /book - Get all book
export const getBookHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const book = await prisma.book.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.book.count();

    res.json({
      data: book,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch book',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

getBookHandler.apiDoc = {
  summary: 'Get all book',
  description: 'Retrieve a paginated list of book',
  operationId: 'getBook',
  tags: ['Book'],
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
      description: 'Successfully retrieved book',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Book',
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

// GET /book/:id - Get book by ID
export const getBookByIdHandler: RouteHandler = async (
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

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      res.status(404).json({
        error: 'Not found',
        message: 'Book not found',
        status: 404,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch book',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

getBookByIdHandler.apiDoc = {
  summary: 'Get book by ID',
  description: 'Retrieve a specific book by its ID',
  operationId: 'getBookById',
  tags: ['Book'],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'integer',
        minimum: 1,
      },
      description: 'Book ID',
    },
  ],
  responses: {
    '200': {
      description: 'Successfully retrieved book',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Book',
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
      description: 'Book not found',
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

// POST /book - Create new book
export const createBookHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await prisma.book.create({
      data: req.body,
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create book',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

createBookHandler.apiDoc = {
  summary: 'Create new book',
  description: 'Create a new book',
  operationId: 'createBook',
  tags: ['Book'],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreateBookRequest',
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'Successfully created book',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Book',
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

// PUT /book/:id - Update book
export const updateBookHandler: RouteHandler = async (
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

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      res.status(404).json({
        error: 'Not found',
        message: 'Book not found',
        status: 404,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const book = await prisma.book.update({
      where: { id },
      data: req.body,
    });

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update book',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

updateBookHandler.apiDoc = {
  summary: 'Update book',
  description: 'Update an existing book',
  operationId: 'updateBook',
  tags: ['Book'],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'integer',
        minimum: 1,
      },
      description: 'Book ID',
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/UpdateBookRequest',
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Successfully updated book',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Book',
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
      description: 'Book not found',
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

// DELETE /book/:id - Delete book
export const deleteBookHandler: RouteHandler = async (
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

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      res.status(404).json({
        error: 'Not found',
        message: 'Book not found',
        status: 404,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    await prisma.book.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete book',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

deleteBookHandler.apiDoc = {
  summary: 'Delete book',
  description: 'Delete an existing book',
  operationId: 'deleteBook',
  tags: ['Book'],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'integer',
        minimum: 1,
      },
      description: 'Book ID',
    },
  ],
  responses: {
    '204': {
      description: 'Successfully deleted book',
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
      description: 'Book not found',
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
router.get('/', validatePagination, handleValidationErrors, getBookHandler);
router.get(
  '/:id',
  validateGetBookById,
  handleValidationErrors,
  getBookByIdHandler
);
router.post('/', validateCreateBook, handleValidationErrors, createBookHandler);
router.put(
  '/:id',
  validateUpdateBook,
  handleValidationErrors,
  updateBookHandler
);
router.delete(
  '/:id',
  validateGetBookById,
  handleValidationErrors,
  deleteBookHandler
);

export default router;
