# PERN-Fortress Monorepo Template 🏰

<!-- License & Repository Info -->

![GitHub](https://img.shields.io/github/license/33SLueck/Pern-docker-fortress)
![GitHub Stars](https://img.shields.io/github/stars/33SLueck/Pern-docker-fortress?style=social)
![GitHub Forks](https://img.shields.io/github/forks/33SLueck/Pern-docker-fortress?style=social)

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

Ein modernes, flexibles PERN Stack Monorepo-Template mit TypeScript, Docker und CI/CD – ready für Production & eigene Projekte!

## ✨ Features

- 🏗️ **Monorepo Architecture** mit npm Workspaces
- ⚡ **Modern Tech Stack** (React 19, Express 5, TypeScript 5.9+)
- 🐳 **Docker Ready** mit Multi-stage Builds
- 🔄 **Automated CI/CD** mit GitHub Actions
- 🛡️ **Code Quality Gates** (ESLint, Prettier, Husky)
- 📦 **Dependency Management** mit Dependabot
- 🧪 **Testing Setup** (Vitest, React Testing Library)
- 🎯 **Production Ready** mit Health Checks

## 🏗️ Tech Stack

### Frontend

- **React 19** (oder eigene Version) mit TypeScript
- **Vite** als Build-Tool
- **Tailwind CSS v4** (optional)
- **Vitest** für Unit Tests
- **React Testing Library**

### Backend

- **Express.js v5** (oder eigene API) mit TypeScript
- **Node.js** Runtime
- **PostgreSQL 16** Database
- **Prisma ORM** für Type-safe Database Access
- **Prisma Studio** für Database Management
- RESTful API Architektur
- Health Check Endpoints

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
├── frontend/                # React Frontend Workspace
│   ├── Dockerfile           # Multi-stage Build für Vite
│   ├── nginx.conf           # NGINX Config für SPA-Routing
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── __tests__/
│   ├── package.json
│   ├── vite.config.ts
│   ├── eslint.config.js
│   └── tsconfig.json
├── backend/                 # Express Backend Workspace
│   ├── Dockerfile           # Multi-stage Build für Node.js
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   ├── eslint.config.js
│   └── tsconfig.json
├── eslint.config.js         # Root ESLint Config
├── commitlint.config.js     # Commit Message Rules
└── .prettierrc             # Code Formatting Rules
```

---

## 🛠️ Development

### Wichtige Scripts (Root)

```bash
npm run dev              # Startet Frontend & Backend (Entwicklung)
npm run build            # Build für alle Workspaces
npm run lint             # Lint für alle Workspaces
npm run lint:fix         # Lint + Auto-fix für alle Workspaces
npm run test             # Tests für alle Workspaces
npm run format           # Prettier Formatierung
npm run type-check       # TypeScript Checks
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

### Development URLs

- **Frontend Development**: http://localhost:5176
- **Backend Development**: http://localhost:3006
- **Frontend Production** (Docker): http://localhost:5176
- **Backend Production** (Docker): http://localhost:3006

### API Documentation

- Erweitere die API-Dokumentation nach Bedarf
- Swagger/OpenAPI Integration möglich
- Postman Collections empfohlen

---

## �️ Database & Prisma

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

- **React 19.1+** (Latest with Concurrent Features)
- **Express 5.1+** (Modern HTTP Framework)
- **TypeScript 5.9+** (Type Safety & Performance)
- **PostgreSQL 16+** (Reliable Database)
- **Prisma 6.14+** (Type-safe ORM)
- **Tailwind CSS 4+** (Modern CSS Framework)### Development Tools

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
