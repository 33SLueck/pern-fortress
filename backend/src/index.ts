import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to PERN Backend API',
    status: 'Running',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API routes placeholder
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'API endpoints will be added here',
    version: '1.0.0',
  });
});

// Start server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
