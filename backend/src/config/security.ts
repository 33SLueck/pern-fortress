import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Express, Request, Response, NextFunction } from 'express';

/**
 * Security Middleware Configuration
 *
 * Diese Datei konfiguriert alle sicherheitsrelevanten Middleware
 * für die Express.js Anwendung.
 */

// Rate Limiting Configuration
export const rateLimitConfig = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Limit jede IP auf 100 Requests pro windowMs
  message: {
    error: 'Too many requests from this IP',
    status: 429,
    timestamp: new Date().toISOString(),
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Strict Rate Limiting für sensible Endpunkte (z.B. Auth)
export const strictRateLimitConfig = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 5, // Nur 5 Versuche pro IP
  message: {
    error: 'Too many attempts from this IP, please try again later',
    status: 429,
    timestamp: new Date().toISOString(),
    retryAfter: '15 minutes',
  },
});

// CORS Configuration
export const corsConfig = cors({
  origin: function (origin, callback) {
    // Erlaubte Origins basierend auf Environment
    const allowedOrigins = [
      'http://localhost:3000', // React Dev Server
      'http://localhost:5173', // Vite Dev Server
      'http://localhost:5176', // Docker Frontend
      'http://localhost:3006', // Backend (für Swagger)
    ];

    // In Entwicklung: Erlaube alle Origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // In Produktion: Prüfe allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Erlaube Cookies
  optionsSuccessStatus: 200, // Legacy browser support
});

// Helmet Configuration - Environment-basiert
export const helmetConfig = helmet({
  // Content Security Policy - strict in Production, relaxed in Development
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        ...(process.env.NODE_ENV !== 'production' ? ["'unsafe-inline'"] : []), // Nur in Development
        'fonts.googleapis.com',
        ...(process.env.NODE_ENV !== 'production' ? ['cdn.jsdelivr.net'] : []), // Swagger UI CDN nur in Dev
      ],
      fontSrc: [
        "'self'",
        'fonts.gstatic.com',
        ...(process.env.NODE_ENV !== 'production' ? ['cdn.jsdelivr.net'] : []), // Swagger UI CDN nur in Dev
      ],
      scriptSrc: [
        "'self'",
        ...(process.env.NODE_ENV !== 'production'
          ? [
              "'unsafe-inline'", // Für Swagger UI - NUR Development
              "'unsafe-eval'", // Für Swagger UI - NUR Development
              'cdn.jsdelivr.net', // Swagger UI CDN - NUR Development
            ]
          : []),
      ],
      imgSrc: [
        "'self'",
        'data:',
        ...(process.env.NODE_ENV !== 'production'
          ? [
              'validator.swagger.io', // Für Swagger UI - NUR Development
              'cdn.jsdelivr.net', // Swagger UI CDN - NUR Development
            ]
          : []),
      ],
      connectSrc: [
        "'self'",
        'http://localhost:3000', // Backend in Container
        'http://localhost:3006', // Backend über Docker Port
        ...(process.env.NODE_ENV !== 'production'
          ? [
              'https://validator.swagger.io', // Swagger Validator - NUR Development
            ]
          : []),
      ],
    },
  },

  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Disable für Swagger UI

  // Andere Security Headers
  hsts: {
    maxAge: 31536000, // 1 Jahr
    includeSubDomains: true,
    preload: true,
  },

  // Referrer Policy
  referrerPolicy: {
    policy: ['origin', 'unsafe-url'],
  },
});

/**
 * Konfiguriert alle Security Middleware für die Express App
 */
export const configureSecurity = (app: Express): void => {
  // CORS - Muss vor anderen Middleware stehen
  app.use(corsConfig);

  // Helmet - HTTP Security Headers
  app.use(helmetConfig);

  // Rate Limiting - Global
  app.use(rateLimitConfig);

  const environment = process.env.NODE_ENV || 'development';
  console.log(`✅ Security middleware configured for ${environment}`);

  if (environment === 'production') {
    console.log(
      '🔒 Production security: Strict CSP, no unsafe-inline/unsafe-eval'
    );
  } else {
    console.log('🔓 Development security: Relaxed CSP for Swagger UI');
  }
};

/**
 * Security Headers für API-Responses
 */
export const setSecurityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Custom Security Headers
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-Powered-By-Custom', 'PERN-Fortress');

  // Remove default Express headers
  res.removeHeader('X-Powered-By');

  next();
};

export default {
  configureSecurity,
  setSecurityHeaders,
  rateLimitConfig,
  strictRateLimitConfig,
  corsConfig,
  helmetConfig,
};
