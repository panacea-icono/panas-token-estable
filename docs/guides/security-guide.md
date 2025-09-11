# 🔒 Guía de Seguridad - PanasToken Estable

## 📋 Descripción General

Esta guía proporciona información detallada sobre las medidas de seguridad implementadas en el PanasToken Estable y las mejores prácticas para mantener la seguridad del sistema.

## 🛡️ Arquitectura de Seguridad

### Principios de Seguridad

1. **Defensa en Profundidad**: Múltiples capas de seguridad
2. **Principio de Menor Privilegio**: Acceso mínimo necesario
3. **Seguridad por Diseño**: Integrada desde el inicio
4. **Monitoreo Continuo**: Detección proactiva de amenazas
5. **Respuesta Rápida**: Plan de respuesta a incidentes

### Capas de Seguridad

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  • Validación de entrada                               │
│  • Sanitización de datos                               │
│  • HTTPS obligatorio                                   │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                          │
│  • Rate limiting                                        │
│  • Autenticación JWT                                   │
│  • Validación de requests                              │
│  • Logging de seguridad                                │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                    │
│  • Validación de datos                                 │
│  • Encriptación de datos sensibles                     │
│  • Manejo seguro de errores                            │
│  • Auditoría de operaciones                            │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Blockchain (Algorand)                │
│  • Transacciones firmadas                              │
│  • Validación criptográfica                            │
│  • Inmutabilidad de datos                              │
│  • Consenso distribuido                                │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Autenticación y Autorización

### 1. Autenticación JWT

```typescript
// Configuración JWT
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
  algorithm: 'HS256',
  issuer: 'panas-token-api',
  audience: 'panas-token-users'
};

// Middleware de autenticación
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};
```

### 2. Autorización Basada en Roles

```typescript
// Roles del sistema
enum UserRole {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
  AUDITOR = 'auditor'
}

// Middleware de autorización
export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    next();
  };
};

// Uso en rutas
app.post('/token/mint', 
  authenticateToken, 
  requireRole([UserRole.MANAGER, UserRole.ADMIN]), 
  mintTokens
);
```

### 3. Validación de Permisos de Token

```typescript
// Verificar permisos para operaciones de token
export const checkTokenPermissions = async (
  operation: string,
  userAddress: string,
  tokenAddress: string
): Promise<boolean> => {
  const token = await getTokenInfo(tokenAddress);
  
  switch (operation) {
    case 'mint':
    case 'burn':
      return token.manager === userAddress;
    case 'freeze':
      return token.freeze === userAddress;
    case 'clawback':
      return token.clawback === userAddress;
    case 'transfer':
      return true; // Cualquier usuario puede transferir
    default:
      return false;
  }
};
```

## 🔒 Encriptación y Protección de Datos

### 1. Encriptación de Datos Sensibles

```typescript
import crypto from 'crypto';

// Configuración de encriptación
const encryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  tagLength: 16
};

// Encriptar datos sensibles
export function encryptSensitiveData(data: string, key: string): string {
  const iv = crypto.randomBytes(encryptionConfig.ivLength);
  const cipher = crypto.createCipher(encryptionConfig.algorithm, key);
  cipher.setAAD(Buffer.from('panas-token'));
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
}

// Desencriptar datos sensibles
export function decryptSensitiveData(encryptedData: string, key: string): string {
  const [ivHex, tagHex, encrypted] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  
  const decipher = crypto.createDecipher(encryptionConfig.algorithm, key);
  decipher.setAAD(Buffer.from('panas-token'));
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### 2. Hash de Contraseñas y Datos

```typescript
import bcrypt from 'bcrypt';

// Hash de contraseñas
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verificar contraseña
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Hash de datos para integridad
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}
```

### 3. Protección de Variables de Entorno

```typescript
// Validación de variables de entorno críticas
export function validateEnvironment(): void {
  const requiredVars = [
    'JWT_SECRET',
    'DATABASE_URL',
    'ALGORAND_NETWORK',
    'ENCRYPTION_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
  }

  // Validar fortaleza de JWT_SECRET
  if (process.env.JWT_SECRET!.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
  }
}
```

## 🚫 Validación y Sanitización

### 1. Validación de Entrada

```typescript
import Joi from 'joi';

// Esquemas de validación
export const validationSchemas = {
  address: Joi.string()
    .pattern(/^[A-Z2-7]{58}$/)
    .required()
    .messages({
      'string.pattern.base': 'Dirección de Algorand inválida'
    }),

  amount: Joi.number()
    .positive()
    .max(Number.MAX_SAFE_INTEGER)
    .required()
    .messages({
      'number.positive': 'El monto debe ser positivo',
      'number.max': 'El monto excede el límite máximo'
    }),

  transferRequest: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    amount: Joi.number().positive().required(),
    note: Joi.string().max(1000).optional()
  })
};

// Middleware de validación
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};
```

### 2. Sanitización de Datos

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitizar entrada HTML
export function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

// Sanitizar entrada de texto
export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remover caracteres HTML
    .replace(/['"]/g, '') // Remover comillas
    .trim()
    .substring(0, 1000); // Limitar longitud
}

// Sanitizar dirección de Algorand
export function sanitizeAddress(address: string): string {
  return address
    .toUpperCase()
    .replace(/[^A-Z2-7]/g, '') // Solo caracteres válidos
    .substring(0, 58); // Longitud exacta
}
```

### 3. Protección contra Inyección

```typescript
// Protección contra SQL Injection
export function escapeSQLString(input: string): string {
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z');
}

// Protección contra NoSQL Injection
export function sanitizeMongoQuery(query: any): any {
  if (typeof query === 'string') {
    return query.replace(/[${}]/g, '');
  }
  
  if (typeof query === 'object' && query !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(query)) {
      sanitized[sanitizeMongoQuery(key)] = sanitizeMongoQuery(value);
    }
    return sanitized;
  }
  
  return query;
}
```

## 🚨 Rate Limiting y Protección DDoS

### 1. Rate Limiting por Usuario

```typescript
import rateLimit from 'express-rate-limit';

// Rate limiting general
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: {
    error: 'Demasiadas solicitudes, intenta más tarde',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting para operaciones críticas
export const criticalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 requests por minuto
  message: {
    error: 'Límite de operaciones críticas excedido',
    retryAfter: '1 minuto'
  }
});

// Rate limiting por IP
export const ipRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.ip,
  message: {
    error: 'Límite de IP excedido',
    retryAfter: '15 minutos'
  }
});
```

### 2. Protección contra Ataques

```typescript
// Detección de patrones sospechosos
export function detectSuspiciousActivity(req: Request): boolean {
  const suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /onload/i,
    /onerror/i,
    /eval/i,
    /expression/i
  ];

  const userAgent = req.get('User-Agent') || '';
  const body = JSON.stringify(req.body);

  return suspiciousPatterns.some(pattern => 
    pattern.test(userAgent) || pattern.test(body)
  );
}

// Middleware de protección
export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Verificar headers de seguridad
  if (!req.get('User-Agent')) {
    return res.status(400).json({ error: 'User-Agent requerido' });
  }

  // Detectar actividad sospechosa
  if (detectSuspiciousActivity(req)) {
    logger.warn('Actividad sospechosa detectada', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    
    return res.status(403).json({ error: 'Actividad sospechosa detectada' });
  }

  next();
};
```

## 📊 Auditoría y Logging de Seguridad

### 1. Logging de Eventos de Seguridad

```typescript
// Logger de seguridad
export const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security.log',
      level: 'info'
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Eventos de seguridad a registrar
export const logSecurityEvent = (event: string, details: any) => {
  securityLogger.info('Security Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
    severity: 'HIGH'
  });
};

// Ejemplos de uso
logSecurityEvent('LOGIN_ATTEMPT', {
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  success: false,
  reason: 'Invalid credentials'
});

logSecurityEvent('UNAUTHORIZED_ACCESS', {
  ip: req.ip,
  endpoint: req.path,
  method: req.method,
  user: req.user?.id
});
```

### 2. Auditoría de Operaciones

```typescript
// Auditoría de operaciones críticas
export const auditOperation = async (
  operation: string,
  userId: string,
  details: any
) => {
  const auditLog = {
    operation,
    userId,
    details,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };

  // Guardar en base de datos
  await auditLogModel.create(auditLog);
  
  // Log de seguridad
  securityLogger.info('Audit Log', auditLog);
};

// Middleware de auditoría
export const auditMiddleware = (operation: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Auditar después de la respuesta
      auditOperation(operation, req.user?.id, {
        request: {
          method: req.method,
          path: req.path,
          body: req.body
        },
        response: {
          status: res.statusCode,
          data: data
        }
      });
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};
```

## 🔍 Monitoreo de Seguridad

### 1. Detección de Anomalías

```typescript
// Detector de anomalías
export class AnomalyDetector {
  private static instance: AnomalyDetector;
  private requestCounts: Map<string, number> = new Map();
  private suspiciousIPs: Set<string> = new Set();

  static getInstance(): AnomalyDetector {
    if (!AnomalyDetector.instance) {
      AnomalyDetector.instance = new AnomalyDetector();
    }
    return AnomalyDetector.instance;
  }

  // Detectar IPs sospechosas
  detectSuspiciousIP(ip: string): boolean {
    const count = this.requestCounts.get(ip) || 0;
    this.requestCounts.set(ip, count + 1);

    // Si más de 100 requests en 1 minuto
    if (count > 100) {
      this.suspiciousIPs.add(ip);
      this.alertSecurityTeam(ip, 'High request volume');
      return true;
    }

    return false;
  }

  // Alertar al equipo de seguridad
  private alertSecurityTeam(ip: string, reason: string) {
    securityLogger.warn('Security Alert', {
      ip,
      reason,
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL'
    });

    // Enviar notificación (email, Slack, etc.)
    this.sendSecurityNotification(ip, reason);
  }

  private sendSecurityNotification(ip: string, reason: string) {
    // Implementar notificación
    console.log(`SECURITY ALERT: ${ip} - ${reason}`);
  }
}
```

### 2. Health Checks de Seguridad

```typescript
// Health check de seguridad
export const securityHealthCheck = async (): Promise<boolean> => {
  const checks = [
    checkJWTConfiguration(),
    checkDatabaseSecurity(),
    checkEncryptionKeys(),
    checkRateLimiting(),
    checkLoggingConfiguration()
  ];

  const results = await Promise.all(checks);
  const allPassed = results.every(result => result === true);

  if (!allPassed) {
    securityLogger.error('Security health check failed', {
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL'
    });
  }

  return allPassed;
};

// Verificaciones individuales
async function checkJWTConfiguration(): Promise<boolean> {
  try {
    const secret = process.env.JWT_SECRET;
    return secret && secret.length >= 32;
  } catch {
    return false;
  }
}

async function checkDatabaseSecurity(): Promise<boolean> {
  try {
    // Verificar conexión encriptada
    const dbUrl = process.env.DATABASE_URL;
    return dbUrl && dbUrl.startsWith('postgresql://');
  } catch {
    return false;
  }
}
```

## 🚨 Plan de Respuesta a Incidentes

### 1. Clasificación de Incidentes

```typescript
enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

enum IncidentType {
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  DATA_BREACH = 'data_breach',
  DDOS_ATTACK = 'ddos_attack',
  MALWARE = 'malware',
  CONFIGURATION_ERROR = 'configuration_error'
}

// Clasificar incidente
export function classifyIncident(
  type: IncidentType,
  impact: number,
  urgency: number
): IncidentSeverity {
  const score = impact * urgency;
  
  if (score >= 80) return IncidentSeverity.CRITICAL;
  if (score >= 60) return IncidentSeverity.HIGH;
  if (score >= 40) return IncidentSeverity.MEDIUM;
  return IncidentSeverity.LOW;
}
```

### 2. Respuesta Automática

```typescript
// Respuesta automática a incidentes
export class IncidentResponse {
  static async handleIncident(
    type: IncidentType,
    severity: IncidentSeverity,
    details: any
  ) {
    const incident = {
      id: generateIncidentId(),
      type,
      severity,
      details,
      timestamp: new Date().toISOString(),
      status: 'active'
    };

    // Registrar incidente
    await this.logIncident(incident);

    // Respuesta según severidad
    switch (severity) {
      case IncidentSeverity.CRITICAL:
        await this.handleCriticalIncident(incident);
        break;
      case IncidentSeverity.HIGH:
        await this.handleHighIncident(incident);
        break;
      default:
        await this.handleStandardIncident(incident);
    }
  }

  private static async handleCriticalIncident(incident: any) {
    // Bloquear IPs sospechosas
    await this.blockSuspiciousIPs(incident.details.ip);
    
    // Notificar equipo inmediatamente
    await this.notifySecurityTeam(incident, 'IMMEDIATE');
    
    // Activar modo de emergencia
    await this.activateEmergencyMode();
  }
}
```

## 📋 Checklist de Seguridad

### Pre-Despliegue

- [ ] Variables de entorno seguras configuradas
- [ ] Certificados SSL válidos
- [ ] Firewall configurado
- [ ] Rate limiting implementado
- [ ] Logging de seguridad activado
- [ ] Tests de seguridad pasando
- [ ] Auditoría de código completada

### Post-Despliegue

- [ ] Monitoreo de seguridad activo
- [ ] Alertas configuradas
- [ ] Backup de datos realizado
- [ ] Plan de respuesta a incidentes probado
- [ ] Equipo de seguridad notificado
- [ ] Documentación de seguridad actualizada

### Mantenimiento Continuo

- [ ] Revisión regular de logs
- [ ] Actualización de dependencias
- [ ] Pruebas de penetración
- [ ] Auditoría de seguridad
- [ ] Entrenamiento del equipo
- [ ] Actualización de políticas

## 🆘 Contacto de Seguridad

Para reportar vulnerabilidades o incidentes de seguridad:

- **Email**: security@panacea-icono.com
- **PGP Key**: [security-key.pgp](security-key.pgp)
- **Responsible Disclosure**: [security.panas-token.com](https://security.panas-token.com)

**¡La seguridad es responsabilidad de todos!** 🛡️
