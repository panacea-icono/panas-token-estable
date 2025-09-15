#!/bin/bash

# Script para desplegar usando Vercel CLI con configuración manual
# Uso: ./scripts/deploy-with-vercel-cli.sh

set -e

# Configuración
PROJECT_ID="prj_8V2CEf88FXnIGzRNW88nnXe6dDAU"
SUBDOMAIN="token.panas.app"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Desplegando con Vercel CLI${NC}"

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi

# Navegar al directorio del frontend
cd frontend/dapp

echo -e "${YELLOW}🔍 Verificando configuración...${NC}"

# Verificar archivos necesarios
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json no encontrado${NC}"
    exit 1
fi

if [ ! -f "next.config.js" ]; then
    echo -e "${RED}❌ Error: next.config.js no encontrado${NC}"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ Error: vercel.json no encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivos de configuración encontrados${NC}"

# Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install

# Construir el proyecto
echo -e "${YELLOW}🔨 Construyendo proyecto...${NC}"
npm run build

echo -e "${GREEN}✅ Proyecto construido exitosamente${NC}"

# Configurar variables de entorno para Vercel
export VERCEL_PROJECT_ID="$PROJECT_ID"

echo -e "${YELLOW}🚀 Desplegando a Vercel...${NC}"
echo -e "${BLUE}Proyecto ID: $PROJECT_ID${NC}"

# Intentar desplegar
echo -e "${YELLOW}💡 Nota: Si no estás autenticado con Vercel CLI, ejecuta: vercel login${NC}"

# Desplegar con configuración específica
vercel --prod --confirm --project-id="$PROJECT_ID" --yes

echo -e "${GREEN}🎉 Despliegue completado${NC}"

# Obtener URL del deployment
echo -e "${YELLOW}🔍 Obteniendo información del deployment...${NC}"
DEPLOYMENT_URL=$(vercel ls --project-id="$PROJECT_ID" | head -2 | tail -1 | awk '{print $2}')

if [ -n "$DEPLOYMENT_URL" ]; then
    echo -e "${GREEN}✅ Deployment URL: $DEPLOYMENT_URL${NC}"
    
    # Configurar alias
    echo -e "${YELLOW}🔗 Configurando alias $SUBDOMAIN...${NC}"
    vercel alias set "$DEPLOYMENT_URL" "$SUBDOMAIN" --project-id="$PROJECT_ID"
    
    echo -e "${GREEN}✅ Alias configurado: $SUBDOMAIN${NC}"
else
    echo -e "${YELLOW}⚠️  No se pudo obtener la URL del deployment${NC}"
fi

# Verificar el despliegue
echo -e "${YELLOW}🔍 Verificando despliegue...${NC}"
sleep 10

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$SUBDOMAIN")

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}🎉 ¡Éxito! $SUBDOMAIN está funcionando correctamente${NC}"
    echo -e "${GREEN}✅ HTTP Status: $HTTP_STATUS${NC}"
elif [ "$HTTP_STATUS" = "404" ]; then
    echo -e "${YELLOW}⚠️  HTTP Status: $HTTP_STATUS - Puede tomar unos minutos para propagarse${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP Status: $HTTP_STATUS${NC}"
fi

echo -e "${BLUE}📋 Información del despliegue:${NC}"
echo -e "  • URL: https://$SUBDOMAIN"
echo -e "  • Proyecto: $PROJECT_ID"
echo -e "  • Estado HTTP: $HTTP_STATUS"
echo -e "  • Deployment: $DEPLOYMENT_URL"

echo -e "${GREEN}✨ Proceso completado${NC}"
echo -e "${BLUE}💡 Para verificar el estado, visita: https://$SUBDOMAIN${NC}"
