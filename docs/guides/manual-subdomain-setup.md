# 🔧 Configuración Manual del Subdominio token.panas.app

## 🎯 Objetivo

Configurar el subdominio `token.panas.app` para el proyecto PanasToken Estable usando el ID del proyecto Vercel: `prj_8V2CEf88FXnIGzRNW88nnXe6dDAU`

## 📋 Información del Proyecto

- **ID del Proyecto**: `prj_8V2CEf88FXnIGzRNW88nnXe6dDAU`
- **Subdominio**: `token.panas.app`
- **Token de Webhook**: `eIhe5OXfe9gq7SeUPHAD0Xpw`
- **Directorio Frontend**: `frontend/dapp/`

## 🚀 Opción 1: Vercel CLI (Recomendado)

### Prerrequisitos

```bash
# Instalar Vercel CLI
npm install -g vercel

# Autenticarse con Vercel
vercel login
```

### Pasos de Despliegue

```bash
# 1. Navegar al directorio del frontend
cd panas-token-estable/frontend/dapp

# 2. Instalar dependencias
npm install

# 3. Construir el proyecto
npm run build

# 4. Desplegar con el proyecto específico
vercel --prod --confirm --project-id="prj_8V2CEf88FXnIGzRNW88nnXe6dDAU"

# 5. Configurar alias para el subdominio
vercel alias set [DEPLOYMENT_URL] token.panas.app --project-id="prj_8V2CEf88FXnIGzRNW88nnXe6dDAU"
```

### Script Automatizado

```bash
# Ejecutar script automatizado
cd panas-token-estable
./scripts/deploy-with-vercel-cli.sh
```

## 🌐 Opción 2: Dashboard de Vercel

### 1. Acceder al Dashboard

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Buscar el proyecto con ID: `prj_8V2CEf88FXnIGzRNW88nnXe6dDAU`
3. Hacer clic en el proyecto

### 2. Configurar Dominio

1. Ir a **Settings** → **Domains**
2. Hacer clic en **Add Domain**
3. Ingresar: `token.panas.app`
4. Hacer clic en **Add**

### 3. Configurar Alias

1. Ir a **Deployments**
2. Seleccionar el último deployment
3. Hacer clic en **...** → **Add Domain**
4. Seleccionar `token.panas.app`
5. Confirmar la configuración

## 🔄 Opción 3: GitHub Actions (Automático)

### Configuración de Secretos

En GitHub, agregar los siguientes secretos:

```
VERCEL_TOKEN=eIhe5OXfe9gq7SeUPHAD0Xpw
VERCEL_PROJECT_ID=prj_8V2CEf88FXnIGzRNW88nnXe6dDAU
VERCEL_ORG_ID=[TU_ORG_ID]
VERCEL_WEBHOOK_TOKEN=eIhe5OXfe9gq7SeUPHAD0Xpw
```

### Despliegue Automático

```bash
# Hacer commit y push
git add .
git commit -m "feat: configuración para token.panas.app"
git push origin main
```

El GitHub Actions desplegará automáticamente y configurará el subdominio.

## 📊 Verificación

### 1. Verificar HTTP Status

```bash
curl -I https://token.panas.app
# Esperado: HTTP/2 200
```

### 2. Verificar Contenido

```bash
curl https://token.panas.app
# Debe mostrar la página de PANAS Token Estable
```

### 3. Verificar en Browser

- Abrir https://token.panas.app
- Debe mostrar la página principal del token

## 🔧 Archivos de Configuración

### vercel.json
```json
{
  "version": 2,
  "name": "panas-token-dapp",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://panas.app/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
```

## 🚨 Troubleshooting

### Error: "Project not found"

```bash
# Verificar que el proyecto ID sea correcto
echo "prj_8V2CEf88FXnIGzRNW88nnXe6dDAU"

# Verificar permisos en Vercel
vercel whoami
```

### Error: "Domain already exists"

```bash
# Verificar dominios existentes
vercel domains ls

# Si existe, remover y volver a agregar
vercel domains rm token.panas.app
vercel domains add token.panas.app
```

### Error: "Build failed"

```bash
# Verificar dependencias
cd frontend/dapp
npm install

# Verificar configuración
npm run build
```

### Error: "DNS not propagated"

```bash
# Verificar DNS
nslookup token.panas.app

# Esperar propagación (puede tomar hasta 24 horas)
```

## 📞 Soporte

Si encuentras problemas:

1. **Revisar logs de Vercel**: Dashboard → Deployments → Logs
2. **Verificar configuración**: Archivos vercel.json y next.config.js
3. **Contactar equipo**: [GitHub Issues](https://github.com/panacea-icono/panas-token-estable/issues)

## ✅ Checklist de Verificación

- [ ] Vercel CLI instalado y autenticado
- [ ] Proyecto ID correcto: `prj_8V2CEf88FXnIGzRNW88nnXe6dDAU`
- [ ] Archivos de configuración creados
- [ ] Dependencias instaladas
- [ ] Proyecto construido exitosamente
- [ ] Deployment ejecutado
- [ ] Alias configurado: `token.panas.app`
- [ ] HTTP status 200
- [ ] Página cargando correctamente
- [ ] Webhooks funcionando

---

**🎯 Objetivo**: Tener `https://token.panas.app` funcionando correctamente con el webhook configurado usando el token `eIhe5OXfe9gq7SeUPHAD0Xpw`.
