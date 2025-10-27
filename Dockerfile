# ---------- Build ----------
FROM node:20 AS build
WORKDIR /app

# Copiamos sólo los manifests para cachear deps
COPY package*.json ./

# Si hay lockfile, usa ci; si no, usa install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copiamos el resto del código
COPY . .

# Evita hardcodear dominio: mejor relativo
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ---------- Runtime ----------
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]