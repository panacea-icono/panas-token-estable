# 🚀 Guía de Despliegue - PanasToken Estable

## 📋 Descripción General

Esta guía proporciona instrucciones detalladas para desplegar el
PanasToken Estable en diferentes entornos, desde desarrollo hasta
producción.

## 🏗️ Arquitectura de Despliegue

### Componentes Principales

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Blockchain    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Algorand)    │
│   Port: 3000    │    │   Port: 8080    │    │   Network       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │   Database      │    │   Monitoring    │
│   (Assets)      │    │   (PostgreSQL)  │    │   (Logs/Metrics)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Prerrequisitos

### Herramientas Requeridas

```bash
# Node.js y npm
node --version  # v18.0.0+
npm --version   # v8.0.0+

# Docker (opcional)
docker --version
docker-compose --version

# Git
git --version

# Algorand CLI (opcional)
goal --version
```

### Cuentas y Servicios

- **Algorand Wallet**: Para transacciones
- **GitHub**: Para CI/CD
- **Docker Hub**: Para imágenes (opcional)
- **Cloud Provider**: AWS, GCP, Azure, etc.

## 🌍 Entornos de Despliegue

### 1. Desarrollo Local

#### Configuración Inicial

```bash
# Clonar repositorio
git clone https://github.com/panacea-icono/panas-token-estable.git
cd panas-token-estable

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

#### Variables de Entorno para Desarrollo

```env
# .env
NODE_ENV=development
PORT=8080
ALGORAND_NETWORK=testnet

# Algorand Testnet
TESTNET_MANAGER_ADDRESS=tu_direccion_manager
TESTNET_RESERVE_ADDRESS=tu_direccion_reserve
TESTNET_FREEZE_ADDRESS=tu_direccion_freeze
TESTNET_CLAWBACK_ADDRESS=tu_direccion_clawback

# Base de datos (opcional para desarrollo)
DATABASE_URL=postgresql://user:password@localhost:5432/panas_dev

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/development.log
```

#### Ejecutar en Desarrollo

```bash
# Backend
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

### 2. Staging

#### Configuración de Staging

```env
# .env.staging
NODE_ENV=staging
PORT=8080
ALGORAND_NETWORK=testnet

# Algorand Testnet (cuentas de staging)
TESTNET_MANAGER_ADDRESS=staging_manager_address
TESTNET_RESERVE_ADDRESS=staging_reserve_address
TESTNET_FREEZE_ADDRESS=staging_freeze_address
TESTNET_CLAWBACK_ADDRESS=staging_clawback_address

# Base de datos
DATABASE_URL=postgresql://user:password@staging-db:5432/panas_staging

# Logging
LOG_LEVEL=info
LOG_FILE=logs/staging.log

# Monitoreo
SENTRY_DSN=your_sentry_dsn
```

#### Desplegar en Staging

```bash
# Construir aplicación
npm run build

# Construir frontend
cd frontend
npm run build
cd ..

# Desplegar con Docker
docker-compose -f docker-compose.staging.yml up -d

# O desplegar manualmente
npm start
```

### 3. Producción

#### Configuración de Producción

```env
# .env.production
NODE_ENV=production
PORT=8080
ALGORAND_NETWORK=mainnet

# Algorand Mainnet
MAINNET_MANAGER_ADDRESS=production_manager_address
MAINNET_RESERVE_ADDRESS=production_reserve_address
MAINNET_FREEZE_ADDRESS=production_freeze_address
MAINNET_CLAWBACK_ADDRESS=production_clawback_address

# Base de datos
DATABASE_URL=postgresql://user:password@prod-db:5432/panas_production

# Logging
LOG_LEVEL=warn
LOG_FILE=logs/production.log

# Monitoreo
SENTRY_DSN=your_production_sentry_dsn
PROMETHEUS_ENDPOINT=http://prometheus:9090

# Seguridad
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
```

## 🐳 Despliegue con Docker

### 1. Dockerfile Principal

```dockerfile
# Dockerfile
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/
COPY scripts/ ./scripts/
COPY tsconfig.json ./

RUN npm run build

FROM node:20-slim AS production

RUN apt-get update && apt-get install -y dumb-init
RUN groupadd -g 1001 nodejs && useradd -r -u 1001 -g nodejs panas

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN mkdir -p logs && chown -R panas:nodejs /app

USER panas

EXPOSE 8080

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### 2. Docker Compose

#### Desarrollo

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
      - ALGORAND_NETWORK=testnet
    volumes:
      - ./src:/app/src
      - ./logs:/app/logs
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
    depends_on:
      - app

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: panas_dev
      POSTGRES_USER: panas
      POSTGRES_PASSWORD: panas123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Producción

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - ALGORAND_NETWORK=mainnet
    volumes:
      - ./logs:/app/logs
    depends_on:
      - db
      - redis
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - app
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: panas_production
      POSTGRES_USER: panas
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 3. Comandos de Docker

```bash
# Construir imagen
docker build -t panas-token:latest .

# Ejecutar contenedor
docker run -d -p 8080:8080 --name panas-token panas-token:latest

# Ejecutar con docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down
```

## ☁️ Despliegue en la Nube

### 1. AWS

#### Elastic Beanstalk

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar aplicación
eb init panas-token

# Crear entorno
eb create panas-token-prod

# Desplegar
eb deploy
```

#### ECS con Fargate

```yaml
# ecs-task-definition.json
{
  "family": "panas-token",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "panas-token",
      "image": "your-account.dkr.ecr.region.amazonaws.com/panas-token:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/panas-token",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 2. Google Cloud Platform

#### Cloud Run

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/panas-token', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/panas-token']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'panas-token', '--image', 'gcr.io/$PROJECT_ID/panas-token', '--region', 'us-central1']
```

#### Comandos GCP

```bash
# Construir y desplegar
gcloud builds submit --tag gcr.io/PROJECT_ID/panas-token

# Desplegar en Cloud Run
gcloud run deploy panas-token --image gcr.io/PROJECT_ID/panas-token --platform managed --region us-central1
```

### 3. Azure

#### Container Instances

```bash
# Crear grupo de recursos
az group create --name panas-token-rg --location eastus

# Crear instancia de contenedor
az container create \
  --resource-group panas-token-rg \
  --name panas-token \
  --image your-registry.azurecr.io/panas-token:latest \
  --ports 8080 \
  --environment-variables NODE_ENV=production
```

## 🔄 CI/CD con GitHub Actions

### 1. Workflow de Despliegue

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t panas-token:${{ github.sha }} .
      - name: Push to registry
        run: docker push your-registry/panas-token:${{ github.sha }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to staging
        run: |
          # Deploy to staging environment
          echo "Deploying to staging..."

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deploy to production environment
          echo "Deploying to production..."
```

### 2. Workflow de Tests

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm ci
      - run: npm run test:ci
      - run: npm run lint
      - run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 📊 Monitoreo y Logging

### 1. Configuración de Logs

```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

### 2. Health Checks

```typescript
// src/health.ts
import express from 'express';
import { healthCheck } from './utils/health';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const health = await healthCheck();
    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

export default router;
```

### 3. Métricas con Prometheus

```typescript
// src/metrics.ts
import client from 'prom-client';

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const tokenTransfers = new client.Counter({
  name: 'token_transfers_total',
  help: 'Total number of token transfers',
  labelNames: ['from', 'to']
});

export { httpRequestDuration, tokenTransfers };
```

## 🔒 Seguridad

### 1. Variables de Entorno Seguras

```bash
# Usar secretos en GitHub Actions
- name: Deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    API_KEY: ${{ secrets.API_KEY }}
```

### 2. HTTPS y SSL

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.panas-token.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://app:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Firewall y Red

```bash
# Configurar firewall
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

## 🚨 Rollback y Recuperación

### 1. Estrategia de Rollback

```bash
# Rollback con Docker
docker-compose down
docker-compose -f docker-compose.prod.yml up -d --scale app=0
docker-compose -f docker-compose.prod.yml up -d --scale app=1

# Rollback con Git
git checkout previous-stable-commit
npm run build
npm start
```

### 2. Backup de Base de Datos

```bash
# Backup
pg_dump -h localhost -U panas panas_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql -h localhost -U panas panas_production < backup_20240101_120000.sql
```

### 3. Monitoreo de Salud

```bash
# Health check
curl http://localhost:8080/health

# Verificar logs
docker-compose logs -f app

# Verificar métricas
curl http://localhost:8080/metrics
```

## 📋 Checklist de Despliegue

### Pre-Despliegue

- [ ] Tests pasando
- [ ] Linting sin errores
- [ ] Build exitoso
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Certificados SSL válidos

### Despliegue

- [ ] Código desplegado
- [ ] Servicios iniciados
- [ ] Health checks pasando
- [ ] Logs sin errores
- [ ] Métricas funcionando

### Post-Despliegue

- [ ] Aplicación accesible
- [ ] Funcionalidades probadas
- [ ] Monitoreo activo
- [ ] Alertas configuradas
- [ ] Documentación actualizada

## 🆘 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a base de datos**

   ```bash
   # Verificar conexión
   psql -h localhost -U panas -d panas_production
   ```

2. **Error de memoria insuficiente**

   ```bash
   # Aumentar memoria
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

3. **Error de permisos**

   ```bash
   # Verificar permisos
   ls -la logs/
   chmod 755 logs/
   ```

### Logs de Debugging

```bash
# Ver logs en tiempo real
docker-compose logs -f app

# Ver logs específicos
tail -f logs/error.log
tail -f logs/combined.log
```

¡Despliegue exitoso! 🎉
