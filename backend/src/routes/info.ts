import type { Request, Response } from 'express';
import { Router } from 'express';

const router = Router();

interface OpenApiResponse {
  description: string;
  content?: {
    'application/json': {
      schema: Record<string, unknown>;
    };
  };
}

interface RouteHandler {
  (req: Request, res: Response): void;
  apiDoc?: {
    summary: string;
    description: string;
    operationId: string;
    tags: string[];
    responses: Record<string, OpenApiResponse>;
  };
}

interface WelcomeResponse {
  message: string;
  status: string;
  timestamp: string;
}

interface ApiInfoResponse {
  message: string;
  version: string;
}

export const welcomeHandler: RouteHandler = (
  req: Request,
  res: Response
): void => {
  const response: WelcomeResponse = {
    message: 'Welcome to PERN Backend API',
    status: 'Running',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
};

welcomeHandler.apiDoc = {
  summary: 'Welcome endpoint',
  description: 'Returns a welcome message and server status',
  operationId: 'welcome',
  tags: ['API Info'],
  responses: {
    '200': {
      description: 'Welcome message',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Welcome to PERN Backend API',
              },
              status: {
                type: 'string',
                example: 'Running',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2025-08-15T13:00:00.000Z',
              },
            },
          },
        },
      },
    },
  },
};

export const apiInfoHandler: RouteHandler = (
  req: Request,
  res: Response
): void => {
  const response: ApiInfoResponse = {
    message: 'API endpoints will be added here',
    version: '1.0.0',
  };
  res.json(response);
};

apiInfoHandler.apiDoc = {
  summary: 'API information endpoint',
  description: 'Returns general API information and version',
  operationId: 'apiInfo',
  tags: ['API Info'],
  responses: {
    '200': {
      description: 'API information',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'API endpoints will be added here',
              },
              version: {
                type: 'string',
                example: '1.0.0',
              },
            },
          },
        },
      },
    },
  },
};

router.get('/', welcomeHandler);
router.get('/api', apiInfoHandler);

export default router;
