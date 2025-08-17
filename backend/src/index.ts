import express, { Express, Request, Response } from 'express';
import { configureSecurity, setSecurityHeaders } from './config/security';
import userRoutes from './routes/users';
import healthRoutes from './routes/health';
import infoRoutes from './routes/info';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger';
import winston from 'winston';

// Logger-Konfiguration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: '/app/log/app.log' })],
});

// Beispiel-Log beim Start
logger.info('Backend gestartet', { service: 'backend' });

// Swagger setup function - nur für Development
function setupSwagger(app: Express): void {
  if (process.env.NODE_ENV === 'development') {
    try {
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

      // Swagger JSON endpoint
      app.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpecs);
      });
    } catch (error) {
      console.warn('[swagger]: Failed to load swagger config:', error);
    }
  } else {
    console.log('[swagger]: Swagger UI disabled in production');

    // In Production: 404 für Swagger-Routen
    app.get('/api-docs*', (req: Request, res: Response) => {
      res
        .status(404)
        .json({ error: 'Documentation not available in production' });
    });
  }
}

const app: Express = express();
const port = process.env.PORT || 3000;

// Security Middleware (muss früh kommen!)
configureSecurity(app);

// Basic Middleware
app.use(express.json());
app.use(setSecurityHeaders);

// Setup Swagger UI
setupSwagger(app);

// Root Routes (non-versioned)
app.use('/', infoRoutes);

// API v1 Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/users', userRoutes);
// Start server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
