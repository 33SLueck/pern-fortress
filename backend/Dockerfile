# ---- Build Stage ----
FROM node:20-alpine AS build



WORKDIR /app

# Log-Verzeichnis für Build-Stage anlegen (wichtig für Tests und Dev)
RUN mkdir -p /app/log && chmod 777 /app/log

# Log-Verzeichnis für den Logger anlegen (wichtig für CI und Containerbetrieb)
RUN mkdir -p /app/log && chmod 777 /app/log

# Nur package.json und package-lock.json kopieren für bessere Caching-Stufen
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
COPY ./prisma ./prisma  

RUN npm install --production=false

# Prisma Client generieren vor Build
RUN npx prisma generate

RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma   

RUN npm install --production

# Generate Prisma Client nach Installation
RUN npx prisma generate

EXPOSE 3000

# Script für automatische Migration und Start
CMD ["sh", "-c", "\
    echo 'Starting PERN-Fortress Backend...' && \
    echo 'Waiting for database connection...' && \
    timeout 60 sh -c 'until nc -z ${DATABASE_HOST:-db} ${DATABASE_PORT:-5432}; do echo \"Waiting for database...\"; sleep 2; done' && \
    echo 'Database connected successfully!' && \
    echo 'Running migration deploy to ensure schema is up to date...' && \
    npx prisma migrate deploy && \
    echo 'Generating Prisma client...' && \
    npx prisma generate && \
    echo 'Starting application server...' && \
    node dist/index.js \
    "]