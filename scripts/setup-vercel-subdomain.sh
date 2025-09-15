#!/bin/bash

# Script para configurar el subdominio token.panas.app en Vercel
# Uso: ./scripts/setup-vercel-subdomain.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Configurando subdominio token.panas.app en Vercel${NC}"

# Verificar que VERCEL_TOKEN esté configurado
if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}❌ Error: VERCEL_TOKEN no está configurado${NC}"
    echo "Configura la variable de entorno: export VERCEL_TOKEN=eIhe5OXfe9gq7SeUPHAD0Xpw"
    exit 1
fi

# Verificar que el token funcione
echo -e "${YELLOW}🔍 Verificando token de Vercel...${NC}"
VERCEL_USER=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v2/user | jq -r '.user.username // empty')

if [ -z "$VERCEL_USER" ]; then
    echo -e "${RED}❌ Error: Token de Vercel inválido${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Token válido para usuario: $VERCEL_USER${NC}"

# Verificar dominio panas.app
echo -e "${YELLOW}🔍 Verificando dominio panas.app...${NC}"
DOMAIN_INFO=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v5/domains/panas.app)

if echo "$DOMAIN_INFO" | jq -e '.error' > /dev/null; then
    echo -e "${RED}❌ Error: Dominio panas.app no encontrado o no accesible${NC}"
    echo "Asegúrate de que el dominio esté configurado en Vercel"
    exit 1
fi

echo -e "${GREEN}✅ Dominio panas.app verificado${NC}"

# Verificar si el subdominio ya existe
echo -e "${YELLOW}🔍 Verificando subdominio token.panas.app...${NC}"
SUBDOMAIN_INFO=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v5/domains/token.panas.app 2>/dev/null || echo '{"error": "not_found"}')

if echo "$SUBDOMAIN_INFO" | jq -e '.error' > /dev/null; then
    echo -e "${YELLOW}⚠️  Subdominio token.panas.app no existe, creándolo...${NC}"
    
    # Crear subdominio
    CREATE_RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "token",
            "domain": "panas.app"
        }' \
        https://api.vercel.com/v1/domains/panas.app/subdomains)
    
    if echo "$CREATE_RESPONSE" | jq -e '.error' > /dev/null; then
        echo -e "${RED}❌ Error creando subdominio: $(echo "$CREATE_RESPONSE" | jq -r '.error.message')${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Subdominio token.panas.app creado${NC}"
else
    echo -e "${GREEN}✅ Subdominio token.panas.app ya existe${NC}"
fi

# Verificar proyecto de Vercel
echo -e "${YELLOW}🔍 Verificando proyecto panas-token-estable...${NC}"
PROJECTS=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v9/projects)

PROJECT_ID=$(echo "$PROJECTS" | jq -r '.projects[] | select(.name | contains("panas-token")) | .id' | head -1)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: Proyecto panas-token-estable no encontrado${NC}"
    echo "Proyectos disponibles:"
    echo "$PROJECTS" | jq -r '.projects[] | "  - \(.name) (\(.id))"'
    exit 1
fi

echo -e "${GREEN}✅ Proyecto encontrado: $PROJECT_ID${NC}"

# Configurar alias para el subdominio
echo -e "${YELLOW}🔗 Configurando alias token.panas.app para el proyecto...${NC}"

# Obtener el último deployment
DEPLOYMENTS=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&limit=1)

LATEST_DEPLOYMENT=$(echo "$DEPLOYMENTS" | jq -r '.deployments[0].uid')

if [ -z "$LATEST_DEPLOYMENT" ]; then
    echo -e "${RED}❌ Error: No se encontraron deployments para el proyecto${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment encontrado: $LATEST_DEPLOYMENT${NC}"

# Crear alias
ALIAS_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"deploymentId\": \"$LATEST_DEPLOYMENT\",
        \"alias\": \"token.panas.app\"
    }" \
    https://api.vercel.com/v1/deployments/$LATEST_DEPLOYMENT/aliases)

if echo "$ALIAS_RESPONSE" | jq -e '.error' > /dev/null; then
    echo -e "${RED}❌ Error creando alias: $(echo "$ALIAS_RESPONSE" | jq -r '.error.message')${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Alias token.panas.app configurado exitosamente${NC}"

# Verificar configuración final
echo -e "${YELLOW}🔍 Verificando configuración final...${NC}"
sleep 5

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://token.panas.app)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}🎉 ¡Éxito! token.panas.app está funcionando correctamente${NC}"
    echo -e "${GREEN}✅ HTTP Status: $HTTP_STATUS${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP Status: $HTTP_STATUS${NC}"
    echo -e "${YELLOW}💡 Puede tomar unos minutos para que los cambios se propaguen${NC}"
fi

echo -e "${BLUE}📋 Resumen de configuración:${NC}"
echo -e "  • Dominio principal: panas.app"
echo -e "  • Subdominio: token.panas.app"
echo -e "  • Proyecto: $PROJECT_ID"
echo -e "  • Deployment: $LATEST_DEPLOYMENT"
echo -e "  • Usuario: $VERCEL_USER"

echo -e "${GREEN}✨ Configuración completada${NC}"
