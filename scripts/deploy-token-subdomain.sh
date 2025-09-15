#!/bin/bash

# Script para desplegar el subdominio token.panas.app usando Vercel CLI
# Uso: ./scripts/deploy-token-subdomain.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Desplegando token.panas.app con Vercel CLI${NC}"

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi

# Navegar al directorio del frontend
cd frontend/dapp

echo -e "${YELLOW}🔍 Verificando configuración de Next.js...${NC}"

# Verificar que next.config.js existe
if [ ! -f "next.config.js" ]; then
    echo -e "${RED}❌ Error: next.config.js no encontrado${NC}"
    exit 1
fi

# Verificar que vercel.json existe
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ Error: vercel.json no encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivos de configuración encontrados${NC}"

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
    npm install
fi

# Construir el proyecto
echo -e "${YELLOW}🔨 Construyendo proyecto...${NC}"
npm run build

echo -e "${GREEN}✅ Proyecto construido exitosamente${NC}"

# Desplegar con Vercel CLI
echo -e "${YELLOW}🚀 Desplegando a Vercel...${NC}"

# Configurar proyecto específico
export VERCEL_PROJECT_ID="prj_8V2CEf88FXnIGzRNW88nnXe6dDAU"

# Desplegar con alias específico
vercel --prod --confirm --alias token.panas.app --project-id="$VERCEL_PROJECT_ID"

echo -e "${GREEN}🎉 Despliegue completado${NC}"

# Verificar el despliegue
echo -e "${YELLOW}🔍 Verificando despliegue...${NC}"
sleep 10

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://token.panas.app)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ ¡Éxito! token.panas.app está funcionando correctamente${NC}"
    echo -e "${GREEN}✅ HTTP Status: $HTTP_STATUS${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP Status: $HTTP_STATUS${NC}"
    echo -e "${YELLOW}💡 Puede tomar unos minutos para que los cambios se propaguen${NC}"
fi

echo -e "${BLUE}📋 Información del despliegue:${NC}"
echo -e "  • URL: https://token.panas.app"
echo -e "  • Estado: $(curl -s -o /dev/null -w "%{http_code}" https://token.panas.app)"
echo -e "  • Servidor: Vercel"

echo -e "${GREEN}✨ Proceso completado${NC}"
