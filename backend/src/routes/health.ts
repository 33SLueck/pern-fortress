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

interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
}

export const healthCheckHandler: RouteHandler = (
  req: Request,
  res: Response
): void => {
  const response: HealthCheckResponse = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
  res.json(response);
};

healthCheckHandler.apiDoc = {
  summary: 'Health check endpoint',
  description: 'Returns the health status of the server',
  operationId: 'healthCheck',
  tags: ['Health'],
  responses: {
    '200': {
      description: 'Server health status',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/HealthCheck',
          },
        },
      },
    },
  },
};

router.get('/', healthCheckHandler);

export default router;
