# ---------- Build ----------
FROM node:20 AS build
WORKDIR /app

# Instalar deps (cache-friendly)
COPY package*.json ./
RUN npm install

# Copiar código
COPY . .

# Variables de build (ajusta si hace falta)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build
RUN npm run build

# ---------- Runtime ----------
FROM nginx:1.29-alpine

# Silenciar logs de entrypoint (opcional)
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

# Limpiar el contenido por defecto y copiar el build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

# 👉 Copiar nuestra configuración con fallback SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]