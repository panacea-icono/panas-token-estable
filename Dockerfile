# PanasToken Estable - Dockerfile
# Multi-stage build para optimizar el tamaño de la imagen

# Stage 1: Build
FROM node:21-slim AS builder

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY src/ ./src/
COPY scripts/ ./scripts/

# Compilar TypeScript
RUN npm run build

# Stage 2: Production
FROM node:21-slim AS production

# Actualizar paquetes del sistema y limpiar cache
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y dumb-init && \
    rm -rf /var/lib/apt/lists/*

# Crear usuario no-root
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs panas

WORKDIR /app

# Copiar dependencias y código compilado
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Crear directorios necesarios
RUN mkdir -p logs && chown -R panas:nodejs /app

# Cambiar a usuario no-root
USER panas

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicio
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
