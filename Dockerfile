# Etapa de construcción
FROM node:20 AS build

WORKDIR /app

COPY . .

ENV VITE_API_BASE_URL=http://mister.escuriola.com:8844/web

RUN npm install && npm run build

# Etapa de producción: nginx
FROM nginx:alpine

# Elimina el contenido por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia el build generado desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copia un archivo nginx.conf básico si lo necesitas (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]