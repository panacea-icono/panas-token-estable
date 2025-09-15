# 🔧 Solución al Error 404 en token.panas.app

## 🚨 Problema Identificado

El error 404 en `https://token.panas.app` se debe a que:

1. **DNS configurado correctamente**: El subdominio resuelve a las IPs de Vercel
2. **Despliegue faltante**: No hay un deployment activo para el subdominio
3. **Configuración incompleta**: Falta configuración específica para el subdominio

## 🔍 Diagnóstico Realizado

```bash
# Verificación DNS
nslookup token.panas.app
# Resultado: 216.150.16.65, 216.150.1.1 (IPs de Vercel)

# Verificación HTTP
curl -I https://token.panas.app
# Resultado: HTTP/2 404, x-vercel-error: DEPLOYMENT_NOT_FOUND
```

## ✅ Soluciones Implementadas

### 1. Configuración de Vercel

**Archivos creados:**
- `frontend/dapp/vercel.json` - Configuración de Vercel
- `frontend/dapp/next.config.js` - Configuración de Next.js
- `frontend/dapp/app/page.tsx` - Página principal del subdominio

### 2. GitHub Actions Actualizado

**Workflow modificado:**
- `.github/workflows/deploy.yml` - Incluye despliegue específico para token.panas.app

### 3. Scripts de Despliegue

**Scripts creados:**
- `scripts/setup-vercel-subdomain.sh` - Configuración automática
- `scripts/deploy-token-subdomain.sh` - Despliegue manual

## 🚀 Pasos para Solucionar

### Opción 1: Despliegue Automático (Recomendado)

```bash
# 1. Hacer commit y push de los cambios
git add .
git commit -m "feat: configuración para token.panas.app"
git push origin main

# 2. El GitHub Actions desplegará automáticamente
# Verificar en: https://github.com/panacea-icono/panas-token-estable/actions
```

### Opción 2: Despliegue Manual

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Ejecutar script de despliegue
cd panas-token-estable
./scripts/deploy-token-subdomain.sh
```

### Opción 3: Configuración Manual en Vercel

1. **Ir a Vercel Dashboard**: https://vercel.com/dashboard
2. **Seleccionar proyecto**: panas-token-estable
3. **Agregar dominio**: 
   - Settings → Domains
   - Agregar `token.panas.app`
4. **Configurar alias**:
   - Deployments → Último deployment
   - Agregar alias `token.panas.app`

## 🔧 Configuración de Archivos

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

## 📊 Verificación Post-Despliegue

### 1. Verificar HTTP Status
```bash
curl -I https://token.panas.app
# Esperado: HTTP/2 200
```

### 2. Verificar Contenido
```bash
curl https://token.panas.app
# Debe mostrar la página principal del token
```

### 3. Verificar en Browser
- Abrir https://token.panas.app
- Debe mostrar la página de PANAS Token Estable

## 🚨 Troubleshooting Adicional

### Si persiste el error 404:

1. **Verificar DNS propagation**:
   ```bash
   dig token.panas.app
   ```

2. **Verificar en Vercel Dashboard**:
   - Comprobar que el dominio esté configurado
   - Verificar que el deployment esté activo

3. **Verificar logs de Vercel**:
   - Revisar logs de deployment
   - Verificar errores de build

4. **Verificar configuración de dominio**:
   ```bash
   # Verificar configuración DNS
   nslookup token.panas.app
   # Debe apuntar a IPs de Vercel
   ```

### Si el error es de configuración:

1. **Revisar vercel.json**:
   - Sintaxis correcta
   - Configuración de rutas

2. **Revisar next.config.js**:
   - Configuración de rewrites
   - Configuración de headers

3. **Revisar package.json**:
   - Scripts de build
   - Dependencias

## 📞 Soporte

Si el problema persiste:

1. **Revisar logs**: GitHub Actions y Vercel
2. **Contactar equipo**: [GitHub Issues](https://github.com/panacea-icono/panas-token-estable/issues)
3. **Documentación Vercel**: [Vercel Domains Docs](https://vercel.com/docs/concepts/projects/domains)

## ✅ Checklist de Verificación

- [ ] DNS configurado correctamente
- [ ] Archivos de configuración creados
- [ ] GitHub Actions actualizado
- [ ] Deployment ejecutado
- [ ] Dominio configurado en Vercel
- [ ] HTTP status 200
- [ ] Página cargando correctamente
- [ ] Webhooks funcionando

---

**🎯 Objetivo**: Resolver el error 404 en token.panas.app y tener el subdominio funcionando correctamente con el token de webhook `eIhe5OXfe9gq7SeUPHAD0Xpw`.
