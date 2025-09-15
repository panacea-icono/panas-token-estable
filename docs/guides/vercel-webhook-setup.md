# 🔗 Configuración de Webhook de Vercel para panas.app

## 📋 Descripción General

Este documento describe cómo configurar y usar el webhook de Vercel para el dominio `panas.app` en el proyecto PanasToken Estable. El webhook permite recibir notificaciones automáticas sobre eventos de despliegue en Vercel.

## 🎯 Objetivo

- Recibir notificaciones automáticas de eventos de despliegue
- Registrar logs de despliegues para auditoría
- Monitorear el estado de los despliegues de panas.app
- Automatizar tareas post-despliegue

## 🔧 Configuración

### 1. Variables de Entorno

```env
# Token de webhook de Vercel (ya configurado)
VERCEL_TOKEN=eIhe5OXfe9gq7SeUPHAD0Xpw
VERCEL_WEBHOOK_TOKEN=eIhe5OXfe9gq7SeUPHAD0Xpw
VERCEL_DOMAIN=panas.app
```

### 2. Endpoint del Webhook

```
POST https://panas.app/api/webhooks/vercel
```

### 3. Eventos Configurados

El webhook está configurado para recibir los siguientes eventos:

- `deployment.created` - Cuando se inicia un nuevo despliegue
- `deployment.ready` - Cuando el despliegue está listo y disponible
- `deployment.error` - Cuando ocurre un error en el despliegue

## 🚀 Implementación

### 1. Estructura del Webhook Handler

El webhook handler está implementado en `services/api/webhook_handler.py` y incluye:

- **Verificación de firma**: Validación HMAC-SHA256 para seguridad
- **Logging estructurado**: Registro de todos los eventos
- **Manejo de errores**: Gestión robusta de errores
- **Endpoints de monitoreo**: Para verificar estado y logs

### 2. Endpoints Disponibles

#### POST `/api/webhooks/vercel`
Endpoint principal para recibir webhooks de Vercel.

**Headers requeridos:**
```
Content-Type: application/json
x-vercel-signature: <firma_hmac>
```

**Ejemplo de payload:**
```json
{
  "type": "deployment.ready",
  "data": {
    "deploymentId": "dpl_abc123",
    "url": "https://panas.app",
    "projectId": "proj_xyz789",
    "teamId": "team_def456"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

#### GET `/api/webhooks/vercel/status`
Verifica el estado del webhook.

**Respuesta:**
```json
{
  "status": "active",
  "domain": "panas.app",
  "endpoint": "/api/webhooks/vercel",
  "events": ["deployment.created", "deployment.ready", "deployment.error"],
  "last_check": "2024-01-01T12:00:00Z"
}
```

#### GET `/api/webhooks/vercel/logs`
Obtiene logs de despliegues.

**Parámetros:**
- `limit` (opcional): Número máximo de logs (default: 50)

**Respuesta:**
```json
{
  "logs": [
    {
      "timestamp": "2024-01-01T12:00:00Z",
      "event": "vercel_deployment",
      "data": {
        "type": "deployment.ready",
        "data": { ... }
      },
      "domain": "panas.app"
    }
  ],
  "total": 1,
  "limit": 50
}
```

## 🔒 Seguridad

### 1. Verificación de Firma

El webhook utiliza HMAC-SHA256 para verificar la autenticidad de las peticiones:

```python
def verify_vercel_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)
```

### 2. Validación de Payload

Se valida la estructura del payload usando Pydantic:

```python
class VercelWebhookPayload(BaseModel):
    type: str
    data: Dict[str, Any]
    created_at: datetime
    team_id: Optional[str] = None
    project_id: Optional[str] = None
```

### 3. Logging Seguro

Los logs no incluyen información sensible y están estructurados para auditoría.

## 📊 Monitoreo y Logs

### 1. Archivo de Logs

Los logs se almacenan en `logs/vercel_deployments.log` con formato JSON:

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "event": "vercel_deployment",
  "data": {
    "type": "deployment.ready",
    "data": {
      "deploymentId": "dpl_abc123",
      "url": "https://panas.app"
    }
  },
  "domain": "panas.app"
}
```

### 2. Rotación de Logs

Los logs se pueden rotar usando el script `scripts/log-rotation.ts`:

```bash
npm run log:rotate
```

### 3. Monitoreo en Tiempo Real

```bash
# Ver logs en tiempo real
tail -f logs/vercel_deployments.log

# Ver logs estructurados
tail -f logs/vercel_deployments.log | jq '.'
```

## 🛠️ Configuración en Vercel

### 1. Configuración Manual

Para configurar el webhook manualmente en Vercel:

```bash
curl -X POST \
  -H "Authorization: Bearer eIhe5OXfe9gq7SeUPHAD0Xpw" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://panas.app/api/webhooks/vercel",
    "events": ["deployment.created", "deployment.ready", "deployment.error"],
    "secret": "eIhe5OXfe9gq7SeUPHAD0Xpw"
  }' \
  "https://api.vercel.com/v1/integrations/webhooks"
```

### 2. Configuración Automática

El webhook se configura automáticamente durante el despliegue en GitHub Actions (ver `.github/workflows/deploy.yml`).

## 🔄 Flujo de Trabajo

### 1. Despliegue Iniciado

```mermaid
graph LR
    A[Push to main] --> B[GitHub Actions]
    B --> C[Vercel Deploy]
    C --> D[deployment.created]
    D --> E[Webhook Handler]
    E --> F[Log Event]
```

### 2. Despliegue Completado

```mermaid
graph LR
    A[Vercel Ready] --> B[deployment.ready]
    B --> C[Webhook Handler]
    C --> D[Log Event]
    C --> E[Optional Actions]
    E --> F[Invalidate Cache]
    E --> G[Send Notifications]
```

### 3. Error en Despliegue

```mermaid
graph LR
    A[Vercel Error] --> B[deployment.error]
    B --> C[Webhook Handler]
    C --> D[Log Error]
    C --> E[Alert Team]
    E --> F[Slack/Discord]
```

## 🚨 Troubleshooting

### 1. Webhook No Recibe Eventos

**Verificar:**
- URL del webhook es correcta: `https://panas.app/api/webhooks/vercel`
- Token de Vercel es válido
- Servidor está ejecutándose
- Firewall permite peticiones de Vercel

**Debug:**
```bash
# Verificar estado del webhook
curl https://panas.app/api/webhooks/vercel/status

# Verificar logs del servidor
tail -f logs/application/app.log
```

### 2. Error de Firma Inválida

**Causas comunes:**
- Token secreto incorrecto
- Payload modificado en tránsito
- Problema de encoding

**Solución:**
```bash
# Verificar variables de entorno
echo $VERCEL_WEBHOOK_TOKEN

# Verificar configuración
curl https://panas.app/api/webhooks/vercel/status
```

### 3. Logs No Se Generan

**Verificar:**
- Permisos de escritura en directorio `logs/`
- Servicio de logging está activo
- Estructura de directorios correcta

**Solución:**
```bash
# Crear directorio de logs
mkdir -p logs/

# Verificar permisos
ls -la logs/

# Ejecutar manualmente
python -c "from services.api.webhook_handler import configure_vercel_webhook; configure_vercel_webhook()"
```

## 📈 Métricas y Alertas

### 1. Métricas Recomendadas

- Número de despliegues por día
- Tiempo promedio de despliegue
- Tasa de éxito de despliegues
- Latencia del webhook

### 2. Alertas Configuradas

- Despliegue fallido
- Webhook no responde
- Error de autenticación
- Logs de error excesivos

### 3. Dashboard de Monitoreo

```bash
# Ver estadísticas de despliegues
curl https://panas.app/api/webhooks/vercel/logs?limit=100 | jq '.logs | length'

# Ver últimos despliegues
curl https://panas.app/api/webhooks/vercel/logs?limit=10 | jq '.logs[].data.type'
```

## 🔧 Mantenimiento

### 1. Rotación de Logs

```bash
# Rotar logs diariamente
0 0 * * * /usr/bin/node scripts/log-rotation.ts
```

### 2. Limpieza de Logs Antiguos

```bash
# Eliminar logs más antiguos de 30 días
find logs/ -name "*.log" -mtime +30 -delete
```

### 3. Backup de Logs

```bash
# Backup semanal de logs
tar -czf backups/vercel-logs-$(date +%Y%m%d).tar.gz logs/
```

## 📞 Soporte

Para problemas relacionados con el webhook de Vercel:

1. **Revisar logs**: `logs/vercel_deployments.log`
2. **Verificar estado**: `GET /api/webhooks/vercel/status`
3. **Contactar equipo**: [GitHub Issues](https://github.com/panacea-icono/panas-token-estable/issues)
4. **Documentación Vercel**: [Vercel Webhooks Docs](https://vercel.com/docs/concepts/integrations/webhooks)

---

**✅ Configuración Completada**: El webhook de Vercel está configurado para panas.app con el token `eIhe5OXfe9gq7SeUPHAD0Xpw` y listo para recibir eventos de despliegue.
