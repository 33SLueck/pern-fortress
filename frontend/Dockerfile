# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY index.html ./
COPY ./public ./public
COPY ./src ./src

RUN npm install
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist ./
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]