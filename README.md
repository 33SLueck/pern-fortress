# PERN-Fortress Framework 🏰

---

## 🚀 Empfohlener Projektstart

1. **Repository vom Template erstellen** (GitHub "Use this template" oder klonen)
2. **Im Root-Verzeichnis:**
   - `npm install` ausführen (installiert alle Abhängigkeiten für alle Workspaces)
   - `.env.example` nach `.env` kopieren und Werte eintragen
3. **Im backend-Verzeichnis:**
   - `.env.example` nach `.env` kopieren und Werte eintragen (z. B. Datenbank-URL, Secrets)
4. **Projekt starten:**
   - `npm run dev` (für lokalen Start) oder `docker-compose up --build` (für Container)

Damit ist das Framework sofort einsatzbereit – keine weiteren Installationen in den Workspaces nötig!

---

<!-- License & Repository Info -->

![GitHub](https://img.shields.io/github/license/33SLueck/Pern-docker-fortress)
![GitHub Stars](https://img.shields.io/github/stars/33SLueck/Pern-docker-fortress?style=social)
![GitHub Forks](https://img.shields.io/github/forks/33SLueck/Pern-docker-fortress?style=social)

<!-- Framework Shields -->

![Framework](https://img.shields.io/badge/framework-fullstack-blueviolet?logo=castle&logoColor=white)
![Fortress CLI](https://img.shields.io/badge/cli-fortress%20cli-9cf?logo=terminal&logoColor=white)
![Swagger/OpenAPI](https://img.shields.io/badge/swagger-openapi%203.0-brightgreen?logo=swagger&logoColor=white)
![Helmet](https://img.shields.io/badge/helmet.js-security%20headers-yellowgreen?logo=helmet&logoColor=white)
![CORS](https://img.shields.io/badge/cors-enabled-blue?logo=cors&logoColor=white)
![Rate Limiting](https://img.shields.io/badge/rate--limiting-ddos%20protection-orange?logo=shield&logoColor=white)

![Prometheus](https://img.shields.io/badge/prometheus-monitoring-orange?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/grafana-dashboards-orange?logo=grafana&logoColor=white)
![Loki](https://img.shields.io/badge/loki-log%20aggregation-4E9A06?logo=grafana&logoColor=white)

<!-- Tech Stack - PERN Components -->

![PostgreSQL](https://img.shields.io/badge/postgresql-16+-blue?logo=postgresql&logoColor=white)
![Express.js](https://img.shields.io/badge/express-5.1+-green?logo=express&logoColor=white)
![React](https://img.shields.io/badge/react-19+-blue?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=node.js&logoColor=white)

<!-- Development Tools -->

![TypeScript](https://img.shields.io/badge/typescript-5.9+-blue?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/prisma-6.14+-indigo?logo=prisma&logoColor=white)
![Vite](https://img.shields.io/badge/vite-7+-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4+-38B2AC?logo=tailwind-css&logoColor=white)

<!-- Quality & Automation -->

![ESLint](https://img.shields.io/badge/eslint-9+-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-3.4+-F7B93E?logo=prettier&logoColor=white)
![Husky](https://img.shields.io/badge/husky-9+-yellow?logo=git&logoColor=white)
![Dependabot](https://img.shields.io/badge/dependabot-enabled-brightgreen?logo=github&logoColor=white)

<!-- Containerization & CI/CD -->

![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/docker--compose-multi--service-blue?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github--actions-CI%2FCD-blue?logo=github-actions&logoColor=white)
![CI Status](https://img.shields.io/github/actions/workflow/status/33SLueck/Pern-docker-fortress/ci.yml?branch=main&label=CI&logo=github-actions)

**PERN-Fortress ist ein vollwertiges, produktionsreifes Fullstack-Framework** auf Basis des PERN-Stacks (PostgreSQL, Express, React, Node.js) mit TypeScript, Docker und CI/CD. Es bietet weit mehr als ein einfaches Template: Durch die integrierte CLI, automatische Code-Generierung, Security-Best-Practices, OpenAPI/Swagger-Dokumentation und viele weitere Features ist es die ideale Basis für professionelle Projekte und eigene Erweiterungen.

## ✨ Features

- 🏗️ **Monorepo Architecture** mit npm Workspaces
- ⚡ **Modern Fullstack Tech Stack** (React 19, Express 5, TypeScript 5.9+)
- 🏰 **Integrierte Fortress CLI** – Automatisierte Code-Generierung für Backend, Frontend & Datenbank
- � **Automatische OpenAPI/Swagger-Dokumentation** – API-Dokumentation & Testing out-of-the-box
- 🛡️ **Security by Default** – Helmet.js, CORS, Rate Limiting, Input Validation, sichere Error-Handling-Strategien
- � **Docker Ready** mit Multi-stage Builds
- 🔄 **Automated CI/CD** mit GitHub Actions
- 🧪 **Testing Setup** (Vitest, React Testing Library, Supertest)
- 📊 **Monitoring & Dashboards** mit Prometheus & Grafana (Systemmetriken, Visualisierung, Alerting)
- 🎯 **Production Ready** mit Health Checks, Connection Pooling, Monitoring Hooks
- 🔨 **Auto-Generated CRUD** – Routes, Models, Components mit einem Befehl
- 🛡️ **Smart Safety Checks** – Verhindert versehentliches Überschreiben
- 📦 **Dependency Management** mit Dependabot
- 📝 **TypeScript überall** – Type Safety für API, DB und UI

## 🏗️ Tech Stack & Framework-Komponenten

### Frontend

- **React 19** mit TypeScript
- **Vite** als Build-Tool
- **Tailwind CSS v4** (optional)
- **Vitest** & **React Testing Library**

### Backend

- **Express.js v5** mit TypeScript
- **Node.js** Runtime
- **PostgreSQL 16** mit **Prisma ORM**
- **Prisma Studio** für DB-Management
- **Express-Validator** für Input-Validierung
- **Supertest** & **Vitest** für API-Tests
- **Helmet.js** für Security Headers
- **CORS** für Cross-Origin Resource Sharing
- **Express Rate Limit** für DDoS Protection
- **Swagger/OpenAPI** für API-Dokumentation (automatisch generiert)
- **OpenAPI 3.0** Support
- **Automatische Route- und Validation-Registrierung**
- **Production-Ready Security**

### Monitoring & Observability

- **Prometheus**: Leistungsfähiges Metrics-Backend für System- und Applikationsmetriken
- **Grafana**: Visualisierung, Dashboards und Alerting für alle Prometheus-Daten
- **Loki**: Log-Aggregation und -Visualisierung in Grafana

---

### 🔔 Alerting & Benachrichtigungen (Grafana/Prometheus/Loki)

- E-Mail/SMTP-Settings für Alerting sind bereits in der `.env` und im Compose vorbereitet (siehe Abschnitt `GF_SMTP_*`).
- Alerts und Benachrichtigungen werden direkt in der Grafana-Oberfläche konfiguriert:
  - [Grafana Alerting Docs](https://grafana.com/docs/grafana/latest/alerting/)
  - [Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)
- Beispiel: In Grafana unter "Alerting" → "Contact points" die SMTP-Daten aus der `.env` eintragen und Alerts für Dashboards/Queries anlegen.
- Für Slack, Webhook oder andere Kanäle können weitere Contact Points in Grafana ergänzt werden.

**Hinweis:**

- Die konkrete Alert-Logik (z. B. Schwellenwerte, Empfänger) ist projektspezifisch und wird vom Nutzer in Grafana/Prometheus eingerichtet.
- Das Framework liefert die technische Basis, aber keine vordefinierten Alerts.

### Dev Tools

- **ESLint v9** (Flat Config)
- **Prettier**
- **Husky v9** Git Hooks
- **lint-staged**
- **Commitlint**
- **npm Workspaces**

### CI/CD & Automation

- **GitHub Actions** Multi-stage Pipeline
- **Dependabot** Automated Security Updates
- **Docker Compose** Development & Production
- **Automated Testing** auf jeder PR
- **Quality Gates** vor Deployment
- Multi-stage Dockerfiles (Production-ready)

---

## 🚀 Quick Start

### Voraussetzungen

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- Git

### Installation & Start (Development)

```bash
# 1. Repository klonen
git clone <dein-repo-url>
cd <projektname>

# 2. Dependencies installieren (Monorepo)
npm install

# 3. Dev-Server starten (Frontend & Backend)
npm run dev
```

**Standard-Ports:**

Um potentiellen Port-Konflikten vorzubeugen nutzen wir diese Ports . Dies lässt sich einfach im docker-compose.yml verändern.

- Frontend: http://localhost:5176
- Backend: http://localhost:3006
- PostgreSQL: http://localhost:5436
- Prisma Studio: http://localhost:5556

### Production mit Docker

```bash
# Images bauen & starten
docker-compose up --build

# Stoppen & aufräumen
docker-compose down
```

---

## 📁 Projekt Struktur (Template)

```

pern-monorepo-template/
├── README.md
├── package.json              # Root package mit Workspace-Scripts
├── docker-compose.yml        # Docker Compose für alle Services
├── fortress                  # CLI Wrapper Script für einfachen Zugriff
├── .github/
│   ├── workflows/
│   │   └── ci.yml           # GitHub Actions Pipeline
│   └── dependabot.yml       # Automated Dependency Updates
├── .husky/                  # Git Hooks
│   ├── pre-commit          # Lint-staged Checks
│   ├── commit-msg          # Commitlint Validation
│   └── pre-push            # Build & Test Checks
├── .vscode/                 # VS Code Settings
│   ├── settings.json       # Editor Config + Action Buttons
│   └── tasks.json          # Build Tasks
├── cli/                     # 🏰 Fortress CLI Generator
│   ├── src/
│   │   ├── index.ts        # CLI Entry Point
│   │   ├── generators/     # Code Generators
│   │   │   ├── route.ts    # Backend Route Generator
│   │   │   ├── model.ts    # Prisma Model Generator
│   │   │   └── component.ts # React Component Generator
│   │   └── utils/
│   ├── templates/          # Handlebars Templates
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React Frontend Workspace
│   ├── Dockerfile           # Multi-stage Build für Vite
│   ├── nginx.conf           # NGINX Config für SPA-Routing
│   ├── src/
│   │   ├── components/      # Generated & Manual Components
│   │   ├── pages/
│   │   └── __tests__/
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts     # Frontend Testing Config
│   ├── eslint.config.js
│   └── tsconfig.json
├── backend/                 # Express Backend Workspace
│   ├── Dockerfile           # Multi-stage Build für Node.js
│   ├── src/
│   │   ├── index.ts        # Express App mit Auto-Route-Registration
│   │   ├── routes/         # Generated CRUD Routes
│   │   ├── middleware/
│   │   │   └── validation/ # Structured Validation Middleware
│   │   │       ├── index.ts # Auto-Export für alle Validations
│   │   │       └── *.ts    # Generated Validation Rules
│   │   └── __tests__/      # Backend Tests (Vitest + Supertest)
│   ├── prisma/
│   │   ├── schema.prisma   # Auto-Extended Database Schema
│   │   └── seeds/          # Generated Seed Files
│   ├── package.json
│   ├── vitest.config.ts    # Backend Testing Config
│   ├── eslint.config.js
│   └── tsconfig.json
├── eslint.config.js         # Root ESLint Config
├── commitlint.config.js     # Commit Message Rules
└── .prettierrc             # Code Formatting Rules
```

---

## 🏰 Warum ist PERN-Fortress ein Framework?

PERN-Fortress ist **mehr als ein Boilerplate**: Es bietet eine vollständige, automatisierte Entwicklungsumgebung mit CLI, Security, Testing, Dokumentation und Best-Practices. Die Fortress CLI generiert nicht nur Code, sondern integriert neue Features automatisch in die App (z.B. Routen, Validierung, Tests, OpenAPI-Doku). Security-Mechanismen wie Helmet, CORS und Rate Limiting sind standardmäßig aktiv. Die API ist immer dokumentiert und testbar. Damit ist PERN-Fortress ein echtes Framework für produktionsreife Fullstack-Projekte.

---

## 🏰 PERN-Fortress CLI Generator

Der integrierte **Fortress CLI** automatisiert die Erstellung von Backend-Routes, Prisma-Models und React-Components mit einem einzigen Befehl. Alle generierten Komponenten sind vollständig typisiert und production-ready.

### ⚡ Quick CLI Start

```bash
# CLI verfügbar machen
./fortress --help

# Interaktiver Generator (empfohlen für Einsteiger)
./fortress generate

# Direkte Befehle
./fortress generate:route products    # Backend CRUD Route
./fortress generate:model Product     # Prisma Model + Migration
./fortress generate:component ProductCard  # React Component
```

### 🎯 CLI Features

- **🔄 Automatische Integration**: Neue Routen, Models und Components werden automatisch registriert
- **🛡️ Input Validierung**: Jede generierte Route erhält automatisch eine Validation-Middleware
- **🧪 Tests inklusive**: Für alle generierten Features werden Tests erstellt
- **📝 TypeScript**: Vollständige Typisierung für API, DB und UI
- **📚 OpenAPI/Swagger**: Jede Route wird automatisch dokumentiert und ist testbar
- **🔒 Safety First**: Bestehende Dateien werden nicht überschrieben (außer mit --force)

### 🔨 Route Generator

Erstellt vollständige CRUD-Routes mit automatischer Registrierung:

```bash
# Basis Route mit Standard CRUD
./fortress generate:route users

# Route mit benutzerdefinierten HTTP-Methoden
./fortress generate:route products --methods "GET,POST,PUT"

# Route ohne Validierung
./fortress generate:route simple --no-validation

# Bestehende Route überschreiben
./fortress generate:route users --force
```

**Generiert automatisch:**

- ✅ Express Router mit CRUD Endpoints (`GET`, `POST`, `PUT`, `DELETE`)
- ✅ Input Validierung mit express-validator
- ✅ TypeScript Interfaces für Request/Response
- ✅ Vitest Tests mit Supertest
- ✅ Automatische Route-Registrierung in `backend/src/index.ts`
- ✅ Prisma Model Integration
- ✅ OpenAPI/Swagger Documentation (JSDoc)
- ✅ Security Headers (Helmet, CORS)
- ✅ Rate Limiting Configuration
- ✅ Error Handling Middleware

### 🗄️ Model Generator

Erstellt Prisma Models mit Migration und Seeding:

```bash
# Basis Model
./fortress generate:model User

# Model mit benutzerdefinierten Feldern
./fortress generate:model Product --fields "name:string,price:float,active:boolean"

# Model ohne Migration
./fortress generate:model Simple --no-migration

# Model ohne Seed-Daten
./fortress generate:model Basic --no-seed
```

**Generiert automatisch:**

- ✅ Prisma Schema Definition
- ✅ TypeScript Types
- ✅ Seed-Dateien mit Beispieldaten
- ✅ Migration Scripts
- ✅ Automatische Relation-Hints

### 🧩 Component Generator

Erstellt React Components mit TypeScript und Tests:

```bash
# React Functional Component
./fortress generate:component UserCard

# Component in spezifischem Verzeichnis
./fortress generate:component ProfileCard --directory "src/features/profile"

# Component ohne Tests
./fortress generate:component SimpleCard --no-tests

```

**Generiert automatisch:**

- ✅ TypeScript React Component mit Props Interface
- ✅ Vitest Tests mit React Testing Library
- ✅ Storybook Stories
- ✅ Index-Datei für saubere Imports
- ✅ Responsive Design Patterns

### 🛡️ Security & Best Practices (automatisch integriert)

Alle Generatoren prüfen auf bereits existierende Dateien:

```bash
# Sicherheitscheck - verhindert Überschreiben
./fortress generate:component UserCard
# ❌ Komponente "UserCard" existiert bereits

# Überschreiben erzwingen
./fortress generate:component UserCard --force
# ✅ Komponente 'UserCard' erfolgreich generiert!
```

### 📁 Generated Code Structure

```bash
# Nach ./fortress generate:route products
backend/src/
├── routes/
│   └── products.ts              # CRUD Route
├── middleware/validation/
│   ├── products.ts              # Input Validation
│   └── index.ts                 # Auto-export
└── __tests__/
    └── products.test.ts         # Route Tests

# Nach ./fortress generate:component ProductCard
frontend/src/components/ProductCard/
├── ProductCard.tsx              # React Component
├── ProductCard.module.css       # CSS Modules
├── ProductCard.test.tsx         # Component Tests
├── ProductCard.stories.tsx      # Storybook Stories
└── index.ts                     # Clean Exports
```

### 🔧 CLI Verfügbarkeit

Der Fortress CLI ist auf mehrere Weise verfügbar:

```bash
# 1. Direkter Aufruf (empfohlen)
./fortress generate:route users

# 2. Via npm Script
npm run fortress generate:route users

# 3. Via npx (Development)
npx ts-node cli/src/index.ts generate:route users
```

---

## 🛠️ Development

### Wichtige Scripts (Root)

```bash
# Development
npm run dev              # Startet Frontend & Backend (Entwicklung)
npm run build            # Build für alle Workspaces
npm run lint             # Lint für alle Workspaces
npm run lint:fix         # Lint + Auto-fix für alle Workspaces
npm run test             # Tests für alle Workspaces
npm run format           # Prettier Formatierung
npm run type-check       # TypeScript Checks

# Code Generation (Fortress CLI)
npm run fortress         # Fortress CLI (via npx ts-node)
npm run generate         # Interaktiver Generator-Wizard
./fortress               # Direkter CLI-Aufruf (empfohlen)

# Fortress CLI Commands
./fortress generate                    # Interaktiver Wizard
./fortress generate:route <name>       # Backend CRUD Route
./fortress generate:model <name>       # Prisma Model + Migration
./fortress generate:component <name>   # React Component
./fortress --help                     # Vollständige Hilfe
```

### Frontend Scripts

```bash
npm run frontend:dev     # Vite Dev Server
npm run frontend:build   # Production Build
npm run frontend:test    # Vitest Tests
npm run frontend:lint    # ESLint Check
npm run frontend:format  # Prettier Format
```

### Backend Scripts

```bash
npm run backend:dev      # Express Dev Server
npm run backend:build    # TypeScript Compilation
npm run backend:start    # Production Server
npm run backend:lint     # ESLint Check
npm run backend:format   # Prettier Format
```

---

### Logging & Observability

- **Winston Logger** schreibt alle Backend-Logs in ein konfigurierbares Verzeichnis (`LOG_DIR`).
- **Promtail** liest diese Logs und leitet sie an **Loki** weiter, sodass sie in **Grafana** visualisiert werden können.
- Das Log-Verzeichnis ist dynamisch:
  - Lokal & im CI: Standard ist `./log`
  - Im Container: `/app/log` (wird automatisch per `LOG_DIR` gesetzt)
- **Konfiguration:**
  - Das Log-Verzeichnis kann über die Umgebungsvariable `LOG_DIR` gesetzt werden.
  - Beispiel (Node.js/TypeScript):
    ```typescript
    const logDir = process.env.LOG_DIR || './log'; // Standard: ./log, im Container: /app/log
    new winston.transports.File({ filename: path.join(logDir, 'app.log') });
    ```
  - In Dockerfile und docker-compose wird `LOG_DIR=/app/log` automatisch gesetzt.
  - Im CI und lokal ist keine Anpassung nötig, es wird automatisch `./log` verwendet.
- **Hinweis:** Das Log-Verzeichnis wird im CI-Workflow automatisch angelegt, um Permission-Probleme zu vermeiden.

---

### Docker Compose

```bash
docker-compose up --build   # Build & Start aller Container
docker-compose down         # Stop & Remove aller Container
```

---

### Git Workflow & Quality

- **Conventional Commits** (commitlint enforced)
- **pre-commit**: Lint & Format staged files
- **pre-push**: Build & Test

**Commit Message Format:**

```
type(scope): description
feat: Neue Features
fix: Bugfixes
docs: Dokumentation
style: Code-Formatierung
refactor: Refactoring
test: Tests
chore: Build/Tooling
```

---

## 🧪 Testing

### Frontend Testing (Vitest)

```bash
npm run frontend:test          # Run Tests
npm run frontend:test:watch    # Watch Mode
npm run frontend:test:ui       # Test UI Interface
npm run frontend:test:coverage # Coverage Report
```

### Backend Testing

```bash
npm run backend:test           # Run Backend Tests
```

### Test Coverage

- **Automatische Coverage Reports** in `frontend/coverage/`
- **CI Integration** mit Coverage Thresholds
- **Test Artifacts** in GitHub Actions

---

## 🔧 API Endpoints

### Health Check Endpoints

- `GET /health` → Basic Health Status
- `GET /api/health` → Detailed API Health Check

### API Documentation

- **Swagger UI**: <http://localhost:3006/api-docs> (Development)
- **OpenAPI 3.0** Specification verfügbar
- **Automatische API-Docs** aus JSDoc-Kommentaren
- **Interactive Testing** direkt in Swagger UI
- **JSON Schema Validation** für Request/Response

### Development URLs

- **Frontend Development**: <http://localhost:5176>
- **Backend Development**: <http://localhost:3006>
- **API Documentation**: <http://localhost:3006/api-docs>
- **Frontend Production** (Docker): <http://localhost:5176>
- **Backend Production** (Docker): <http://localhost:3006>

### Security Features (automatisch aktiv)

- **Helmet.js**: Security Headers (XSS, CSRF, etc.)
- **CORS**: Konfigurierte Cross-Origin Resource Sharing
- **Rate Limiting**: DDoS Protection mit Express Rate Limit
- **Input Validation**: Express-validator für alle Endpoints
- **Type Safety**: TypeScript für Request/Response Typen
- **Sicheres Error Handling**: Keine sensiblen Infos im Response

### API Documentation & OpenAPI

- **Automatische Swagger/OpenAPI-Dokumentation** für alle Endpoints
- **JSDoc Comments** in allen Route-Definitionen
- **OpenAPI Schemas** für Request/Response Models
- **Error Response Documentation** mit HTTP Status Codes
- **Authentication Documentation** (falls implementiert)
- **Rate Limit Information** in API Responses

---

## 🛡️ Security & Best Practices

### Production-Ready Security (Beispiele)

#### Helmet.js (Security Headers)

```javascript
// Automatisch konfiguriert in express App
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
```

#### CORS (Cross-Origin Resource Sharing)

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5176',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

#### Rate Limiting (DDoS Protection)

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Limit pro IP
  message: 'Too many requests from this IP',
});
app.use('/api/', limiter);
```

### Environment Security

- ✅ **Environment Variables** für alle sensiblen Daten
- ✅ **TypeScript** für Type Safety
- ✅ **Input Validation** mit Express-Validator
- ✅ **Error Handling** ohne sensitive Informationen
- ✅ **Security Headers** via Helmet.js
- ✅ **CORS Protection** für Cross-Origin Requests

## 📉 API Rate-Limit-Feedback

Die API setzt automatisch moderne [RateLimit-Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/RateLimit-Limit) nach [IETF-Standard](https://datatracker.ietf.org/doc/html/rfc6585) für alle Endpunkte, die durch express-rate-limit geschützt sind. Diese Header ermöglichen es Clients, ihr Anfrageverhalten dynamisch anzupassen und das aktuelle Limit auszulesen.

**Beispiel-Header in der Response:**

```
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 1692288000
```

**Client-Beispiel (Fetch/JavaScript):**

```js
fetch('http://localhost:3006/api/users')
  .then((res) => {
    console.log('Limit:', res.headers.get('ratelimit-limit'));
    console.log('Remaining:', res.headers.get('ratelimit-remaining'));
    console.log('Reset:', res.headers.get('ratelimit-reset'));
    return res.json();
  })
  .then((data) => {
    // ...
  });
```

**Hinweis:**

- Die Header sind immer klein geschrieben abrufbar (`res.headers.get('ratelimit-limit')`).
- Die Werte können je nach Konfiguration und Route variieren.
- Bei Überschreitung des Limits wird ein HTTP 429-Fehler mit passender Fehlermeldung zurückgegeben.

---

### Production Deployment Checklist

- [ ] Environment Variables konfiguriert (.env files niemals committen)
- [ ] HTTPS SSL Zertifikate installiert
- [ ] Rate Limiting für Production angepasst
- [ ] Database Connection Pool optimiert
- [ ] Logging and Monitoring eingerichtet
- [ ] Error Tracking (z.B. Sentry) konfiguriert
- [ ] Backup Strategy implementiert
- [ ] Health Checks für Load Balancer aktiviert

---

## 🗄️ Database & Prisma

### PostgreSQL mit Prisma ORM

**Prisma Setup:**

```bash
# Database Migration (im Container)
docker-compose run --rm backend npx prisma migrate dev --name init

# Prisma Client generieren
docker-compose run --rm backend npx prisma generate

# Database seeden (optional)
docker-compose run --rm backend npx prisma db seed
```

### Database Migrations

**Neue Migration erstellen:**

```bash
# 1. Schema in backend/prisma/schema.prisma ändern
# 2. Migration ausführen
docker-compose run --rm backend npx prisma migrate dev --name "add_user_table"


```

oder

```bash

docker exec pern-fortress-backend-1 npx prisma migrate dev --name init


```

**Production Migrations:**

```bash
# Für Production (ohne prompts)
docker-compose run --rm backend npx prisma migrate deploy
```

### Database Seeding

**Seed Script erstellen** (`backend/prisma/seed.ts`):

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Beispiel: Demo-User erstellen
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
    },
  });

  console.log({ alice });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

**In `backend/package.json` hinzufügen:**

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

**Seed ausführen:**

```bash
docker-compose run --rm backend npx prisma db seed
```

## 🗄️ PostgreSQL Backup & Restore

### Backup (Datenbank sichern)

- Stelle sicher, dass in deiner `.env` steht:

  ```env
  POSTGRES_PASSWORD=dein_passwort
  PGPASSWORD=dein_passwort
  ```

- Backup-Service ist im Compose enthalten:

  ```yaml
  db-backup:
    image: postgres:16-alpine
    depends_on:
      - db
    env_file:
      - .env
    volumes:
      - ./db_backups:/backups
    entrypoint:
      [
        'sh',
        '-c',
        'pg_dump -h db -U postgres -F c -b -v -f /backups/backup_$(date +%Y%m%d_%H%M%S).dump postgres',
      ]
  ```

- Backup erstellen:

  ```bash
  docker-compose run --rm db-backup
  # Das Backup findest du in ./db_backups/backup_<datum>.dump

  ```

### Restore (Backup einspielen)

- Stoppe ggf. alle Services, die auf die DB zugreifen.
- Starte einen temporären Restore-Container:

  ```bash
  docker-compose run --rm -v $(pwd)/db_backups:/backups --env-file .env postgres:16-alpine \
    sh -c "pg_restore -h db -U postgres -d postgres -v /backups/backup_<datum>.dump"
  ```

- Passe ggf. den Datenbanknamen und Benutzer an.

**Hinweis:**

- `PGPASSWORD` muss in der `.env` gesetzt sein, damit das Restore funktioniert.
- Für produktive Umgebungen empfiehlt sich zusätzlich ein externes Backup (z.B. S3, Rotation, Verschlüsselung).

### 🛡️ Beispiel: Backup per Shellscript (lokal oder als Cronjob)

Im Ordner `scripts/` findest du ein Beispielscript für lokale Backups:

```bash
./scripts/backup-db.sh
```

Das Script nutzt Docker Compose und legt Dumps im Verzeichnis `./db_backups` an. Es kann auch als Cronjob genutzt werden, z. B. für tägliche Backups:

```cron
0 2 * * * /pfad/zu/deinem/projekt/scripts/backup-db.sh
```

**Hinweis:**

- Passe das Script bei Bedarf an deine Umgebung an (z. B. andere DB-User, Zielverzeichnis).
- Automatische Backups sind best practice, aber die Integration bleibt flexibel.

### Prisma Studio

**Database Browser starten:**

```bash
# Mit Docker Compose
docker-compose up prisma-studio

# Dann öffnen: http://localhost:5556
```

**Lokaler Zugriff:**

```bash
# Falls lokal installiert
cd backend && npx prisma studio
```

### Database URLs

**Development:**

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/postgres"
```

**Production:**

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

---

## �🐳 Docker

### Development mit Docker

```bash
# Alle Services starten (Backend, Frontend, DB, Prisma Studio)
docker-compose up --build

# Nur bestimmte Services
docker-compose up db backend          # Backend + Database
docker-compose up prisma-studio       # Nur Prisma Studio

# Im Hintergrund starten
docker-compose up -d --build# Logs verfolgen
docker-compose logs -f

# Stoppen & Cleanup
docker-compose down
```

### Production Deployment

```bash
# Production Build
docker-compose -f docker-compose.prod.yml up --build

# Mit Volumes für Persistence
docker-compose up -v ./data:/app/data --build
```

### Container Architecture

- **Frontend Container**:
  - Build: Vite → Static Files
  - Runtime: NGINX Alpine
  - Port: 80 → 5176 (extern)
- **Backend Container**:
  - Build: TypeScript → JavaScript
  - Runtime: Node.js Alpine + Prisma
  - Port: 3000 → 3006 (extern)

- **Database Container**:
  - Image: PostgreSQL 16 Alpine
  - Port: 5432 → 5436 (extern)
  - Volume: `postgres_data` für Persistenz

- **Prisma Studio Container**:
  - Build: Backend Image + Prisma Studio
  - Port: 5555 → 5556 (extern)
  - Database Management UI

### Docker Features

- **Multi-stage Builds** für optimale Image-Größe
- **Health Checks** für Container-Monitoring
- **Volume Mounts** für Development
- **Environment Variables** für Konfiguration

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

**Multi-Stage Pipeline:**

1. **Setup**: Node.js 20, npm ci, Cache Management
2. **Frontend**: Build, Test, Lint, Type-Check
3. **Backend**: Build, Lint, Type-Check
4. **Integration**: Health Checks, End-to-End Tests
5. **Docker**: Multi-stage Build & Push (optional)

**Trigger Events:**

- Push to `main` branch
- Pull Requests zu `main`
- Manual Dispatch
- Scheduled runs (optional)

### Dependabot Integration

**Automated Dependency Updates:**

- 📦 **npm packages** (Root, Frontend, Backend)
- ⚙️ **GitHub Actions** workflow updates
- 📅 **Weekly schedule** (Montags 09:00)
- 🏷️ **Auto-labeling** nach Workspace
- 👥 **Auto-assignment** zu Maintainer
- 📝 **Conventional commits** formatting

**Dependency Grouping:**

- React-related packages
- TypeScript tooling
- Vite ecosystem
- Express framework

---

## 📦 Dependencies & Versioning

### Production Dependencies

#### Core Stack

- **React 19.1+** (Latest with Concurrent Features)
- **Express 5.1+** (Modern HTTP Framework)
- **TypeScript 5.9+** (Type Safety & Performance)
- **PostgreSQL 16+** (Reliable Database)
- **Prisma 6.14+** (Type-safe ORM)
- **Tailwind CSS 4+** (Modern CSS Framework)

#### Security & API Documentation

- **Helmet.js 8.0+** (Security Headers & XSS Protection)
- **CORS 2.8+** (Cross-Origin Resource Sharing)
- **Express Rate Limit 7.5+** (DDoS Protection)
- **Express-Validator 7.2+** (Input Validation)
- **Swagger UI Express 5.0+** (API Documentation)
- **OpenAPI Types 12.1+** (Type-safe API Schemas)

#### Development & Testing

- **Vitest 3.5+** (Fast Testing Framework)
- **Supertest 7.1+** (API Testing)
- **MSW 2.9+** (Mock Service Worker)
- **ESLint 9.4+** (Code Quality)
- **Prettier 3.4+** (Code Formatting)
- **Husky 9.1+** (Git Hooks)

### Development Tools

- **ESLint 9.33+** (Code Linting mit Flat Config)
- **Prettier 3.4+** (Code Formatting)
- **Vite 7.0+** (Fast Build Tool)
- **Vitest 3.1+** (Unit Testing Framework)
- **Husky 9.1+** (Git Hooks Management)

### Dependency Management

- **Dependabot** hält Dependencies automatisch aktuell
- **Grouped Updates** für verwandte Packages
- **Security Patches** werden priorisiert
- **Weekly Updates** jeden Montag

---

## 🤝 Contributing

### Contribution Workflow

1. **Fork** das Template Repository
2. **Clone** deinen Fork lokal
3. **Branch** erstellen: `git checkout -b feature/amazing-feature`
4. **Develop** mit allen Quality Checks
5. **Test** sicherstellen: `npm run test`
6. **Commit** mit Conventional Commits: `npm run commit` (Commitizen)
7. **Push** deinen Branch: `git push origin feature/amazing-feature`
8. **Pull Request** erstellen mit detaillierter Beschreibung

### Code Quality Standards

- ✅ **ESLint** Rules müssen erfüllt sein
- ✅ **Prettier** Formatierung angewendet
- ✅ **TypeScript** ohne Errors
- ✅ **Tests** müssen passieren
- ✅ **Build** muss erfolgreich sein
- ✅ **Conventional Commits** befolgen

### Development Setup

```bash
# Repository klonen
git clone https://github.com/33SLueck/Pern-docker-fortress.git
cd Pern-docker-fortress

# Dependencies installieren
npm install

# Pre-commit hooks aktivieren
npm run husky:install

# Development starten
npm run dev

```

---

## 📝 License

MIT License – gerne für eigene Projekte verwenden!

---

**Template by 33SLueck – Star willkommen!**

---
