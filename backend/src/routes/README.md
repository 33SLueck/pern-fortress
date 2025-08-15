# Routes Dokumentation

Diese Dokumentation beschreibt, wie neue API-Routen in diesem PERN Fortress Backend erstellt werden.

## 📁 Struktur

```
src/routes/
├── README.md           # Diese Dokumentation
├── health.ts          # Health Check Endpunkte
├── info.ts            # API Information Endpunkte
├── users.ts           # User Management Endpunkte
└── [neue-route].ts    # Neue Route-Datei
```

## 🚀 Neue Route erstellen

### 1. Route-Datei erstellen

Erstelle eine neue TypeScript-Datei im `routes/` Ordner:

```typescript
// src/routes/example.ts
import type { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// TypeScript Interfaces für bessere Type Safety
interface OpenApiResponse {
  description: string;
  content?: {
    'application/json': {
      schema: Record<string, unknown>;
    };
  };
}

interface RouteHandler {
  (req: Request, res: Response): Promise<void> | void;
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
```

### 2. Handler-Funktionen implementieren

```typescript
// GET /api/v1/examples
export const getExamplesHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Deine Geschäftslogik hier
    const examples = await prisma.example.findMany();

    res.json({
      examples,
      total: examples.length,
    });
  } catch (error) {
    console.error('Error fetching examples:', error);
    res.status(500).json({
      error: 'Failed to fetch examples',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

// API-Dokumentation als Property der Handler-Funktion
getExamplesHandler.apiDoc = {
  summary: 'Get all examples',
  description: 'Retrieve a list of all examples from the database',
  operationId: 'getExamples',
  tags: ['Examples'],
  responses: {
    '200': {
      description: 'List of examples',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              examples: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Example Name' },
                    // Weitere Properties...
                  },
                },
              },
              total: { type: 'integer', example: 42 },
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
              error: { type: 'string', example: 'Failed to fetch examples' },
              status: { type: 'integer', example: 500 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
};
```

### 3. POST-Handler mit Request Body

```typescript
// POST /api/v1/examples
export const createExampleHandler: RouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Validierung
    if (!name) {
      res.status(400).json({
        error: 'Name is required',
        status: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const example = await prisma.example.create({
      data: { name, description },
    });

    res.status(201).json(example);
  } catch (error) {
    console.error('Error creating example:', error);
    res.status(500).json({
      error: 'Failed to create example',
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

createExampleHandler.apiDoc = {
  summary: 'Create a new example',
  description: 'Create a new example in the database',
  operationId: 'createExample',
  tags: ['Examples'],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Example Name' },
            description: { type: 'string', example: 'Example Description' },
          },
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'Example created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Example Name' },
              description: { type: 'string', example: 'Example Description' },
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
  },
};
```

### 4. Routen registrieren

```typescript
// Am Ende der Datei: Routen mit Handlern verknüpfen
router.get('/', getExamplesHandler);
router.post('/', createExampleHandler);
router.get('/:id', getExampleByIdHandler); // Falls implementiert

export default router;
```

### 5. Route in index.ts einbinden

Öffne `src/index.ts` und füge die neue Route hinzu:

```typescript
// Import hinzufügen
import exampleRoutes from './routes/example';

// Route registrieren (unter "// API v1 Routes")
app.use('/api/v1/examples', exampleRoutes);
```

### 6. Swagger-Konfiguration erweitern

Öffne `src/config/swagger.ts` und erweitere die Konfiguration:

```typescript
// Import der Handler hinzufügen
import { getExamplesHandler, createExampleHandler } from '../routes/example';

// In der extractPathsFromHandlers() Funktion hinzufügen:
// Example routes
if (getExamplesHandler.apiDoc) {
  paths['/api/v1/examples'] = {
    get: {
      ...getExamplesHandler.apiDoc,
    },
  };
}

if (createExampleHandler.apiDoc) {
  if (!paths['/api/v1/examples']) {
    paths['/api/v1/examples'] = {};
  }
  paths['/api/v1/examples'] = {
    ...paths['/api/v1/examples'],
    post: {
      ...createExampleHandler.apiDoc,
    },
  };
}
```

## 📋 Best Practices

### ✅ Do's

1. **Konsistente Namensgebung:**
   - Handler: `[action][Resource]Handler` (z.B. `getUsersHandler`)
   - Operationen: `[action][Resource]` (z.B. `getUsers`)

2. **Error Handling:**
   - Immer try-catch verwenden
   - Konsistente Error-Response-Struktur
   - Aussagekräftige Fehlermeldungen

3. **Validierung:**
   - Input-Validierung bei POST/PUT Requests
   - Typ-Checks für Parameter
   - Sanitization bei Bedarf

4. **Dokumentation:**
   - Vollständige apiDoc-Properties
   - Aussagekräftige Descriptions
   - Beispiel-Werte in Schemas

5. **TypeScript:**
   - Strikte Typisierung
   - Interfaces für komplexe Typen
   - Proper Return Types

### ❌ Don'ts

1. **Keine synchronen Operationen** ohne guten Grund
2. **Keine hartcodierten Werte** - verwende Konfiguration
3. **Keine unbehandelten Promises** - immer await/catch
4. **Keine direkten SQL-Queries** - verwende Prisma
5. **Keine Passwörter/Secrets** in Responses

## 🔧 Debugging Tipps

### Backend neu starten

```bash
docker-compose restart backend
```

### Build-Logs anzeigen

```bash
docker-compose logs backend
```

### TypeScript-Errors prüfen

```bash
cd backend && npm run type-check
```

### API testen

```bash
# GET Request
curl -s http://localhost:3006/api/v1/examples

# POST Request
curl -s -X POST http://localhost:3006/api/v1/examples \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Example"}'
```

## 📚 Weitere Ressourcen

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🏗️ Vollständiges Beispiel

Eine vollständige Implementierung findest du in den bestehenden Dateien:

- `users.ts` - Komplette CRUD-Operationen
- `health.ts` - Einfacher GET-Endpunkt
- `info.ts` - Statische Information Endpunkte

---

🚀 **Happy Coding!** Bei Fragen oder Problemen einfach die bestehenden Route-Implementierungen als Referenz verwenden.
