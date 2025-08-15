# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Nur package.json und package-lock.json kopieren für bessere Caching-Stufen
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
COPY ./prisma ./prisma  

RUN npm install --production=false
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma   

RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/index.js"]