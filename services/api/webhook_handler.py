"""
Webhook Handler para Vercel - PanasToken Estable
Maneja eventos de despliegue de Vercel para panas.app
"""

import os
import json
import hmac
import hashlib
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, Request, HTTPException, Header
from pydantic import BaseModel

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

class VercelWebhookPayload(BaseModel):
    """Modelo para el payload del webhook de Vercel"""
    type: str
    data: Dict[str, Any]
    created_at: datetime
    team_id: Optional[str] = None
    project_id: Optional[str] = None

class WebhookEvent(BaseModel):
    """Modelo para eventos de webhook"""
    event_type: str
    timestamp: datetime
    data: Dict[str, Any]
    source: str = "vercel"

def verify_vercel_signature(payload: bytes, signature: str, secret: str) -> bool:
    """
    Verifica la firma del webhook de Vercel
    
    Args:
        payload: Cuerpo de la petición en bytes
        signature: Firma del webhook
        secret: Secreto compartido
        
    Returns:
        bool: True si la firma es válida
    """
    try:
        # Vercel usa HMAC-SHA256
        expected_signature = hmac.new(
            secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        # Comparar firmas de forma segura
        return hmac.compare_digest(signature, expected_signature)
    except Exception as e:
        logger.error(f"Error verificando firma: {e}")
        return False

def log_deployment_event(event_data: Dict[str, Any]) -> None:
    """
    Registra eventos de despliegue en logs
    
    Args:
        event_data: Datos del evento
    """
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "event": "vercel_deployment",
        "data": event_data,
        "domain": "panas.app"
    }
    
    logger.info(f"Vercel deployment event: {json.dumps(log_entry)}")
    
    # Guardar en archivo de logs específico
    log_file = "logs/vercel_deployments.log"
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    
    with open(log_file, "a") as f:
        f.write(json.dumps(log_entry) + "\n")

@router.post("/vercel")
async def handle_vercel_webhook(
    request: Request,
    x_vercel_signature: str = Header(..., alias="x-vercel-signature")
):
    """
    Endpoint para manejar webhooks de Vercel
    
    Args:
        request: Request de FastAPI
        x_vercel_signature: Firma del webhook de Vercel
        
    Returns:
        Dict con status del procesamiento
    """
    try:
        # Obtener el secreto del webhook
        webhook_secret = os.getenv("VERCEL_WEBHOOK_TOKEN")
        if not webhook_secret:
            logger.error("VERCEL_WEBHOOK_TOKEN no configurado")
            raise HTTPException(status_code=500, detail="Webhook secret not configured")
        
        # Leer el cuerpo de la petición
        body = await request.body()
        
        # Verificar la firma
        if not verify_vercel_signature(body, x_vercel_signature, webhook_secret):
            logger.warning("Firma de webhook inválida")
            raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        # Parsear el JSON
        try:
            payload = json.loads(body.decode('utf-8'))
        except json.JSONDecodeError as e:
            logger.error(f"Error parseando JSON: {e}")
            raise HTTPException(status_code=400, detail="Invalid JSON payload")
        
        # Validar el payload
        webhook_payload = VercelWebhookPayload(**payload)
        
        # Procesar según el tipo de evento
        event_type = webhook_payload.type
        
        if event_type == "deployment.created":
            await handle_deployment_created(webhook_payload.data)
        elif event_type == "deployment.ready":
            await handle_deployment_ready(webhook_payload.data)
        elif event_type == "deployment.error":
            await handle_deployment_error(webhook_payload.data)
        else:
            logger.info(f"Evento no manejado: {event_type}")
        
        # Registrar el evento
        log_deployment_event({
            "type": event_type,
            "data": webhook_payload.data,
            "team_id": webhook_payload.team_id,
            "project_id": webhook_payload.project_id
        })
        
        return {
            "status": "success",
            "message": f"Webhook procesado: {event_type}",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error procesando webhook: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

async def handle_deployment_created(data: Dict[str, Any]) -> None:
    """Maneja eventos de creación de despliegue"""
    logger.info(f"Despliegue creado: {data.get('deploymentId', 'unknown')}")
    
    # Aquí puedes agregar lógica específica para cuando se crea un despliegue
    # Por ejemplo: notificaciones, actualización de estado, etc.
    
    # Ejemplo: Notificar al equipo
    # await send_team_notification(f"Nuevo despliegue iniciado: {data.get('url', 'unknown')}")

async def handle_deployment_ready(data: Dict[str, Any]) -> None:
    """Maneja eventos de despliegue listo"""
    deployment_url = data.get('url', 'unknown')
    logger.info(f"Despliegue listo: {deployment_url}")
    
    # Verificar que sea el dominio correcto
    if 'panas.app' in deployment_url:
        logger.info("Despliegue de panas.app completado exitosamente")
        
        # Aquí puedes agregar lógica específica para panas.app
        # Por ejemplo: invalidar cache, actualizar DNS, etc.
        
        # Ejemplo: Invalidar cache de CDN
        # await invalidate_cdn_cache()

async def handle_deployment_error(data: Dict[str, Any]) -> None:
    """Maneja eventos de error en despliegue"""
    error_message = data.get('error', {}).get('message', 'Unknown error')
    logger.error(f"Error en despliegue: {error_message}")
    
    # Aquí puedes agregar lógica para manejar errores
    # Por ejemplo: notificaciones de alerta, rollback automático, etc.
    
    # Ejemplo: Enviar alerta al equipo
    # await send_alert_notification(f"Error en despliegue: {error_message}")

@router.get("/vercel/status")
async def get_webhook_status():
    """
    Endpoint para verificar el estado del webhook
    
    Returns:
        Dict con información del estado
    """
    return {
        "status": "active",
        "domain": "panas.app",
        "endpoint": "/api/webhooks/vercel",
        "events": ["deployment.created", "deployment.ready", "deployment.error"],
        "last_check": datetime.utcnow().isoformat()
    }

@router.get("/vercel/logs")
async def get_deployment_logs(limit: int = 50):
    """
    Endpoint para obtener logs de despliegues
    
    Args:
        limit: Número máximo de logs a retornar
        
    Returns:
        Lista de logs de despliegues
    """
    try:
        log_file = "logs/vercel_deployments.log"
        
        if not os.path.exists(log_file):
            return {"logs": [], "message": "No hay logs disponibles"}
        
        with open(log_file, "r") as f:
            lines = f.readlines()
        
        # Obtener las últimas N líneas
        recent_lines = lines[-limit:] if len(lines) > limit else lines
        
        logs = []
        for line in recent_lines:
            try:
                log_entry = json.loads(line.strip())
                logs.append(log_entry)
            except json.JSONDecodeError:
                continue
        
        return {
            "logs": logs,
            "total": len(logs),
            "limit": limit
        }
        
    except Exception as e:
        logger.error(f"Error leyendo logs: {e}")
        raise HTTPException(status_code=500, detail="Error reading logs")

# Función para configurar el webhook en Vercel (para uso manual)
def configure_vercel_webhook():
    """
    Función helper para configurar el webhook en Vercel
    Esta función puede ser llamada manualmente o desde un script
    """
    webhook_url = "https://panas.app/api/webhooks/vercel"
    webhook_secret = os.getenv("VERCEL_WEBHOOK_TOKEN")
    
    if not webhook_secret:
        logger.error("VERCEL_WEBHOOK_TOKEN no configurado")
        return False
    
    payload = {
        "url": webhook_url,
        "events": ["deployment.created", "deployment.ready", "deployment.error"],
        "secret": webhook_secret
    }
    
    logger.info(f"Configuración del webhook: {json.dumps(payload, indent=2)}")
    
    return True
