# 📊 Directorio de Logs - PanasToken Estable

Este directorio contiene todos los archivos de logging del proyecto PanasToken Estable.

## 📁 Estructura de Directorios

```
logs/
├── 📄 README.md                    # Este archivo
├── 📄 .gitkeep                     # Mantiene el directorio en Git
├── 📁 application/                 # Logs de la aplicación
│   ├── 📄 app.log                  # Log general de la aplicación
│   ├── 📄 error.log                # Log de errores
│   ├── 📄 access.log               # Log de acceso a la API
│   └── 📄 debug.log                # Log de debug
├── 📁 blockchain/                  # Logs de blockchain
│   ├── 📄 testnet.log              # Logs de transacciones testnet
│   ├── 📄 mainnet.log              # Logs de transacciones mainnet
│   ├── 📄 deployment.log           # Logs de despliegue
│   └── 📄 monitoring.log           # Logs de monitoreo
├── 📁 security/                    # Logs de seguridad
│   ├── 📄 auth.log                 # Logs de autenticación
│   ├── 📄 security.log             # Logs de seguridad
│   └── 📄 audit.log                # Logs de auditoría
├── 📁 performance/                 # Logs de rendimiento
│   ├── 📄 metrics.log              # Métricas de rendimiento
│   ├── 📄 memory.log               # Uso de memoria
│   └── 📄 cpu.log                  # Uso de CPU
└── 📁 archived/                    # Logs archivados
    ├── 📄 2024-01/                 # Logs de enero 2024
    ├── 📄 2024-02/                 # Logs de febrero 2024
    └── 📄 ...                      # Más archivos archivados
```

## 🔧 Configuración de Logging

### Niveles de Log
- **ERROR**: Errores críticos que requieren atención inmediata
- **WARN**: Advertencias que pueden indicar problemas
- **INFO**: Información general del funcionamiento
- **DEBUG**: Información detallada para debugging
- **TRACE**: Información muy detallada para análisis profundo

### Rotación de Logs
- **Tamaño máximo**: 10MB por archivo
- **Archivos máximos**: 5 archivos por tipo
- **Compresión**: Automática para archivos antiguos
- **Archivado**: Mensual a directorio `archived/`

### Formato de Logs
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "service": "panas-token-estable",
  "module": "contracts",
  "message": "Token deployed successfully",
  "data": {
    "assetId": 123456,
    "network": "testnet",
    "transactionId": "ABC123..."
  },
  "requestId": "req-123456",
  "userId": "user-789"
}
```

## 📋 Tipos de Logs

### Application Logs
- **app.log**: Log general de la aplicación
- **error.log**: Errores y excepciones
- **access.log**: Accesos a la API REST
- **debug.log**: Información de debugging

### Blockchain Logs
- **testnet.log**: Transacciones en testnet
- **mainnet.log**: Transacciones en mainnet
- **deployment.log**: Logs de despliegue de contratos
- **monitoring.log**: Monitoreo de la red

### Security Logs
- **auth.log**: Intentos de autenticación
- **security.log**: Eventos de seguridad
- **audit.log**: Logs de auditoría

### Performance Logs
- **metrics.log**: Métricas de rendimiento
- **memory.log**: Uso de memoria
- **cpu.log**: Uso de CPU

## 🚨 Alertas y Monitoreo

### Alertas Automáticas
- Errores críticos en `error.log`
- Fallos de autenticación en `auth.log`
- Transacciones fallidas en blockchain logs
- Uso excesivo de recursos en performance logs

### Métricas Clave
- Tiempo de respuesta de transacciones
- Tasa de éxito de operaciones
- Uso de memoria y CPU
- Número de errores por hora

## 🔒 Seguridad

### Información Sensible
- **NUNCA** logear mnemónicos o claves privadas
- **NUNCA** logear información personal de usuarios
- **SÍ** logear hashes de transacciones
- **SÍ** logear direcciones de wallet (públicas)

### Retención
- **Logs de aplicación**: 30 días
- **Logs de blockchain**: 1 año
- **Logs de seguridad**: 2 años
- **Logs de auditoría**: 7 años

## 🛠️ Herramientas de Análisis

### Comandos Útiles
```bash
# Ver logs en tiempo real
tail -f logs/application/app.log

# Buscar errores
grep "ERROR" logs/application/error.log

# Analizar transacciones
grep "transaction" logs/blockchain/testnet.log

# Ver métricas de rendimiento
grep "memory" logs/performance/metrics.log
```

### Herramientas Recomendadas
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Grafana**: Visualización de métricas
- **Prometheus**: Monitoreo de métricas
- **Fluentd**: Agregación de logs

## 📈 Mejores Prácticas

1. **Logging estructurado**: Usar formato JSON
2. **Niveles apropiados**: No logear todo como INFO
3. **Contexto relevante**: Incluir información útil
4. **Rotación regular**: Evitar archivos muy grandes
5. **Monitoreo activo**: Revisar logs regularmente
6. **Retención adecuada**: Cumplir políticas de retención
7. **Seguridad**: No exponer información sensible
