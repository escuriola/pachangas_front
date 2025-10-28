#!/usr/bin/env bash
set -euo pipefail
export DOCKER_BUILDKIT=1

# ==== Config ====
IMAGE="pachangas-frontend"          # nombre de imagen local
NAME="pachangas-frontend"           # nombre del contenedor en prod
SUBDOMAIN="pachangas.escuriola.com" # <— cambia a mister.escuriola.com para el otro
CANARY="${NAME}-canary"
CANARY_PORT=8088
HEALTH_URL="http://127.0.0.1:${CANARY_PORT}/"
BUILD_TAG="$(date +%Y%m%d%H%M%S)"
FULL_IMAGE="${IMAGE}:${BUILD_TAG}"
TRAEFIK_CERTRESOLVER="le"           # el que configuraste en Traefik
TRAEFIK_ENTRYPOINT="websecure"      # 443 en Traefik
TRAEFIK_NETWORK="proxy"             # red externa compartida

# ==== Código ====
git fetch --all --prune
git pull --rebase --autostash

echo "🏗️  Construyendo imagen ${FULL_IMAGE}…"
docker buildx build \
  --progress=plain \
  --no-cache \
  --build-arg NODE_OPTIONS="--max-old-space-size=1024" \
  --build-arg VITE_SOURCEMAP=false \
  --build-arg VITE_API_BASE_URL=/api \
  -t "${FULL_IMAGE}" .

echo "🧹 Eliminando contenedor estable previo (si existe)…"
docker rm -f "${NAME}" >/dev/null 2>&1 || true

echo "🌱 Lanzando canary ${CANARY} en :${CANARY_PORT}…"
docker rm -f "${CANARY}" >/dev/null 2>&1 || true
docker run -d --name "${CANARY}" -p "${CANARY_PORT}:80" "${FULL_IMAGE}" >/dev/null

# Health-check canary
echo -n "🩺 Comprobando salud del canary"
TRIES=60
until curl -fsS "${HEALTH_URL}" >/dev/null 2>&1; do
  TRIES=$((TRIES-1))
  if [ $TRIES -le 0 ]; then
    echo -e "\n❌ Canary no está sano. Abortando despliegue."
    docker logs --tail=100 "${CANARY}" || true
    exit 1
  fi
  echo -n "."
  sleep 1
done
echo -e "\n✅ Canary OK."

# Lanza el contenedor de producción: SIN publicar puertos, con labels Traefik
echo "🚀 Levantando ${NAME} detrás de Traefik para ${SUBDOMAIN}…"
docker rm -f "${NAME}" >/dev/null 2>&1 || true
docker run -d --name "${NAME}" --restart unless-stopped \
  --network proxy \
  --label "traefik.enable=true" \
  --label "traefik.http.routers.${NAME}.rule=Host(\`${SUBDOMAIN}\`) && PathPrefix(\`/\`) && !PathPrefix(\`/api\`)" \
  --label "traefik.http.routers.${NAME}.entrypoints=websecure" \
  --label "traefik.http.routers.${NAME}.tls.certresolver=le" \
  --label "traefik.http.routers.${NAME}.priority=1" \
  --label "traefik.http.services.${NAME}.loadbalancer.server.port=80" \
  "${FULL_IMAGE}" >/dev/null

# Borra canary
docker rm -f "${CANARY}" >/dev/null 2>&1 || true

echo "🗑️  Limpiando imágenes colgantes…"
docker image prune -f >/dev/null 2>&1 || true

echo "🎉 Despliegue completado en https://${SUBDOMAIN}"