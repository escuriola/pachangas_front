#!/usr/bin/env bash
set -euo pipefail

export DOCKER_BUILDKIT=1

IMAGE="misteria-frontend"
NAME="misteria-frontend"
PORT=80
CANARY="${NAME}-canary"
CANARY_PORT=8088
HEALTH_URL="http://127.0.0.1:${CANARY_PORT}/"
BUILD_TAG="$(date +%Y%m%d%H%M%S)"
FULL_IMAGE="${IMAGE}:${BUILD_TAG}"

git fetch --all --prune
git pull --rebase --autostash

echo "🏗️  Construyendo imagen ${FULL_IMAGE}…"
docker buildx build \
  --progress=plain \
  --build-arg NODE_OPTIONS="--max-old-space-size=1024" \
  --build-arg VITE_SOURCEMAP=false \
  -t "${FULL_IMAGE}" .

# Limpieza previa: libera NOMBRE y PUERTO solo de contenedores misteria-frontend*
echo "🧹 Limpiando contenedores antiguos con nombre '${NAME}*' y puerto ${PORT}…"
# 1) elimina contenedor con el nombre estable si existe
docker rm -f "${NAME}" >/dev/null 2>&1 || true
# 2) elimina cualquier misteria-frontend* que publique el puerto 80
for cid in $(docker ps -a --filter "name=^/${NAME}.*" -q); do
  # Si publica el puerto 80, elimínalo
  if docker inspect -f '{{range .NetworkSettings.Ports}}{{.}}{{end}}' "$cid" | grep -q '0.0.0.0:80->'; then
    docker rm -f "$cid" >/dev/null 2>&1 || true
  fi
done

# Asegura que no quede un canary previo
docker rm -f "${CANARY}" >/dev/null 2>&1 || true

# Limpieza de canary si el script termina por error
cleanup_canary() { docker rm -f "${CANARY}" >/dev/null 2>&1 || true; }
trap cleanup_canary EXIT

echo "🌱 Lanzando canary ${CANARY} en :${CANARY_PORT}…"
docker run -d --name "${CANARY}" -p "${CANARY_PORT}:80" "${FULL_IMAGE}" >/dev/null

# Health‑check del canary
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

# Parar/eliminar cualquier contenedor misteria-frontend en :80 (por seguridad)
for cid in $(docker ps -a --filter "name=^/${NAME}.*" -q); do
  if docker inspect -f '{{range .NetworkSettings.Ports}}{{.}}{{end}}' "$cid" | grep -q '0.0.0.0:80->'; then
    docker rm -f "$cid" >/dev/null 2>&1 || true
  fi
done

echo "🚀 Levantando ${NAME} en :${PORT}…"
docker run -d --name "${NAME}" --restart unless-stopped -p "${PORT}:80" "${FULL_IMAGE}" >/dev/null

# Borra canary
docker rm -f "${CANARY}" >/dev/null 2>&1 || true
trap - EXIT

echo "🗑️  Limpiando imágenes colgantes…"
docker image prune -f >/dev/null 2>&1 || true

echo "🎉 Despliegue completado en puerto ${PORT}: ${FULL_IMAGE}"