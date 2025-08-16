import express, { Express } from 'express';
import { configureSecurity, setSecurityHeaders } from './config/security';
import healthRoutes from './routes/health';

const app: Express = express();

// Security Middleware
configureSecurity(app);

// Basic Middleware
app.use(express.json());
app.use(setSecurityHeaders);

// Only health route for testing
app.use('/api/v1/health', healthRoutes);

export default app;
