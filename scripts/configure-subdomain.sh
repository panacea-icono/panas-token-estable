#!/bin/bash

# Script para configurar el subdominio token.panas.app usando la API de Vercel
# Uso: ./scripts/configure-subdomain.sh

set -e

# Configuración
VERCEL_TOKEN="eIhe5OXfe9gq7SeUPHAD0Xpw"
PROJECT_ID="prj_8V2CEf88FXnIGzRNW88nnXe6dDAU"
SUBDOMAIN="token.panas.app"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Configurando subdominio $SUBDOMAIN${NC}"

# Verificar que jq esté instalado
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando jq...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install jq
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y jq
    else
        echo -e "${RED}❌ Error: jq no está instalado y no se puede instalar automáticamente${NC}"
        exit 1
    fi
fi

# Función para hacer peticiones a la API de Vercel
vercel_api() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Authorization: Bearer $VERCEL_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "https://api.vercel.com$endpoint"
    else
        curl -s -X "$method" \
            -H "Authorization: Bearer $VERCEL_TOKEN" \
            "https://api.vercel.com$endpoint"
    fi
}

# Verificar que el proyecto existe
echo -e "${YELLOW}🔍 Verificando proyecto $PROJECT_ID...${NC}"
PROJECT_INFO=$(vercel_api "GET" "/v9/projects/$PROJECT_ID")

if echo "$PROJECT_INFO" | jq -e '.error' > /dev/null; then
    echo -e "${RED}❌ Error: Proyecto $PROJECT_ID no encontrado${NC}"
    echo "Respuesta: $PROJECT_INFO"
    exit 1
fi

PROJECT_NAME=$(echo "$PROJECT_INFO" | jq -r '.name')
echo -e "${GREEN}✅ Proyecto encontrado: $PROJECT_NAME${NC}"

# Obtener el último deployment
echo -e "${YELLOW}🔍 Obteniendo último deployment...${NC}"
DEPLOYMENTS=$(vercel_api "GET" "/v6/deployments?projectId=$PROJECT_ID&limit=1")

LATEST_DEPLOYMENT=$(echo "$DEPLOYMENTS" | jq -r '.deployments[0].uid // empty')

if [ -z "$LATEST_DEPLOYMENT" ]; then
    echo -e "${RED}❌ Error: No se encontraron deployments para el proyecto${NC}"
    echo "Respuesta: $DEPLOYMENTS"
    exit 1
fi

echo -e "${GREEN}✅ Deployment encontrado: $LATEST_DEPLOYMENT${NC}"

# Verificar si el alias ya existe
echo -e "${YELLOW}🔍 Verificando si el alias ya existe...${NC}"
EXISTING_ALIAS=$(vercel_api "GET" "/v2/deployments/$LATEST_DEPLOYMENT/aliases" | jq -r ".aliases[] | select(.alias == \"$SUBDOMAIN\") | .alias")

if [ -n "$EXISTING_ALIAS" ]; then
    echo -e "${GREEN}✅ Alias $SUBDOMAIN ya existe${NC}"
else
    # Crear alias
    echo -e "${YELLOW}🔗 Creando alias $SUBDOMAIN...${NC}"
    ALIAS_DATA="{\"alias\": \"$SUBDOMAIN\"}"
    
    ALIAS_RESPONSE=$(vercel_api "POST" "/v1/deployments/$LATEST_DEPLOYMENT/aliases" "$ALIAS_DATA")
    
    if echo "$ALIAS_RESPONSE" | jq -e '.error' > /dev/null; then
        echo -e "${RED}❌ Error creando alias: $(echo "$ALIAS_RESPONSE" | jq -r '.error.message')${NC}"
        echo "Respuesta completa: $ALIAS_RESPONSE"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Alias $SUBDOMAIN creado exitosamente${NC}"
fi

# Verificar configuración final
echo -e "${YELLOW}🔍 Verificando configuración final...${NC}"
sleep 5

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$SUBDOMAIN")

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}🎉 ¡Éxito! $SUBDOMAIN está funcionando correctamente${NC}"
    echo -e "${GREEN}✅ HTTP Status: $HTTP_STATUS${NC}"
elif [ "$HTTP_STATUS" = "404" ]; then
    echo -e "${YELLOW}⚠️  HTTP Status: $HTTP_STATUS - Puede tomar unos minutos para propagarse${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP Status: $HTTP_STATUS${NC}"
fi

# Mostrar información del deployment
echo -e "${BLUE}📋 Información del deployment:${NC}"
DEPLOYMENT_INFO=$(vercel_api "GET" "/v13/deployments/$LATEST_DEPLOYMENT")
echo -e "  • URL: https://$SUBDOMAIN"
echo -e "  • Deployment ID: $LATEST_DEPLOYMENT"
echo -e "  • Proyecto: $PROJECT_NAME ($PROJECT_ID)"
echo -e "  • Estado HTTP: $HTTP_STATUS"
echo -e "  • Creado: $(echo "$DEPLOYMENT_INFO" | jq -r '.created // "N/A"')"

echo -e "${GREEN}✨ Configuración completada${NC}"
