import express, { Express, Request, Response } from 'express';
import { configureSecurity, setSecurityHeaders } from './config/security';
import userRoutes from './routes/users';
import productsRoutes from './routes/products';
import healthRoutes from './routes/health';
import infoRoutes from './routes/info';
import bookRoutes from './routes/book';
// Swagger imports nur in Development
let swaggerUi: typeof import('swagger-ui-express') | undefined;
let swaggerSpecs: Record<string, unknown> | undefined;

if (process.env.NODE_ENV !== 'production') {
  swaggerUi = require('swagger-ui-express');
  swaggerSpecs = require('./config/swagger').default;
}

const app: Express = express();
const port = process.env.PORT || 3000;

// Security Middleware (muss früh kommen!)
configureSecurity(app);

// Basic Middleware
app.use(express.json());
app.use(setSecurityHeaders);

// Swagger UI setup - NUR in Development verfügbar!
if (process.env.NODE_ENV !== 'production' && swaggerUi && swaggerSpecs) {
  console.log('[swagger]: Swagger UI enabled for development');

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'PERN Fortress API Documentation',
    })
  );

  // Swagger JSON endpoint - auch nur in Development
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
  });
} else {
  console.log('[swagger]: Swagger UI disabled in production');

  // In Production: 404 für Swagger-Routen
  app.get('/api-docs*', (req: Request, res: Response) => {
    res
      .status(404)
      .json({ error: 'Documentation not available in production' });
  });
}

// Root Routes (non-versioned)
app.use('/', infoRoutes);

// API v1 Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productsRoutes);

app.use('/api/v1/book', bookRoutes);
// Start server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
