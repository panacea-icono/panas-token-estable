// PanasToken Estable - Logger Configuration
// Configuración centralizada de logging con Winston

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Crear directorios de logs si no existen
const logDirs = [
  'logs/application',
  'logs/blockchain',
  'logs/security',
  'logs/performance'
];

logDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, service, module, data, requestId, userId, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      service: service || 'panas-token-estable',
      module,
      message,
      data,
      requestId,
      userId,
      ...meta
    });
  })
);

// Configuración de transportes
const transports: winston.transport[] = [
  // Console transport para desarrollo
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
];

// Agregar file transports en producción
if (process.env.NODE_ENV === 'production') {
  // Log general de aplicación
  transports.push(
    new winston.transports.File({
      filename: 'logs/application/app.log',
      level: 'info',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: logFormat
    })
  );

  // Log de errores
  transports.push(
    new winston.transports.File({
      filename: 'logs/application/error.log',
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: logFormat
    })
  );

  // Log de acceso a API
  transports.push(
    new winston.transports.File({
      filename: 'logs/application/access.log',
      level: 'info',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 3,
      format: logFormat
    })
  );
}

// Logger principal
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exitOnError: false
});

// Loggers especializados
export const blockchainLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: 'logs/blockchain/testnet.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5
    })
  ]
});

export const securityLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: 'logs/security/security.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10
    })
  ]
});

export const performanceLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: 'logs/performance/metrics.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 3
    })
  ]
});

// Clase de logger personalizada
export class PanasLogger {
  private service: string;
  private module: string;

  constructor(service: string, module: string) {
    this.service = service;
    this.module = module;
  }

  private createLogData(level: string, message: string, data?: any, requestId?: string, userId?: string) {
    return {
      level,
      service: this.service,
      module: this.module,
      message,
      data,
      requestId,
      userId,
      timestamp: new Date().toISOString()
    };
  }

  info(message: string, data?: any, requestId?: string, userId?: string) {
    logger.info(this.createLogData('info', message, data, requestId, userId));
  }

  error(message: string, error?: Error, data?: any, requestId?: string, userId?: string) {
    logger.error(this.createLogData('error', message, { ...data, error: error?.stack }, requestId, userId));
  }

  warn(message: string, data?: any, requestId?: string, userId?: string) {
    logger.warn(this.createLogData('warn', message, data, requestId, userId));
  }

  debug(message: string, data?: any, requestId?: string, userId?: string) {
    logger.debug(this.createLogData('debug', message, data, requestId, userId));
  }

  // Métodos especializados para blockchain
  logTransaction(transactionId: string, network: 'testnet' | 'mainnet', data: any) {
    const networkLogger = network === 'testnet' ? blockchainLogger : blockchainLogger;
    networkLogger.info('Transaction executed', {
      transactionId,
      network,
      ...data
    });
  }

  logDeployment(assetId: number, network: 'testnet' | 'mainnet', data: any) {
    blockchainLogger.info('Token deployed', {
      assetId,
      network,
      ...data
    });
  }

  // Métodos especializados para seguridad
  logSecurityEvent(event: string, data: any, severity: 'low' | 'medium' | 'high' | 'critical') {
    securityLogger.warn('Security event', {
      event,
      severity,
      ...data
    });
  }

  logAuthAttempt(success: boolean, userId?: string, data?: any) {
    securityLogger.info('Authentication attempt', {
      success,
      userId,
      ...data
    });
  }

  // Métodos especializados para rendimiento
  logPerformance(metric: string, value: number, unit: string, data?: any) {
    performanceLogger.info('Performance metric', {
      metric,
      value,
      unit,
      ...data
    });
  }

  logMemoryUsage(usage: NodeJS.MemoryUsage) {
    performanceLogger.info('Memory usage', {
      rss: usage.rss,
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      external: usage.external,
      arrayBuffers: usage.arrayBuffers
    });
  }
}

// Instancias predefinidas
export const appLogger = new PanasLogger('panas-token-estable', 'application');
export const contractLogger = new PanasLogger('panas-token-estable', 'contracts');
export const apiLogger = new PanasLogger('panas-token-estable', 'api');
export const securityLoggerInstance = new PanasLogger('panas-token-estable', 'security');
export const performanceLoggerInstance = new PanasLogger('panas-token-estable', 'performance');

// Middleware para Express
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  req.requestId = requestId;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };
    
    if (res.statusCode >= 400) {
      apiLogger.error('HTTP Request Error', undefined, logData, requestId);
    } else {
      apiLogger.info('HTTP Request', logData, requestId);
    }
  });
  
  next();
};

// Función para limpiar logs antiguos
export const cleanupOldLogs = () => {
  const logFiles = [
    'logs/application/app.log',
    'logs/application/error.log',
    'logs/application/access.log',
    'logs/blockchain/testnet.log',
    'logs/blockchain/mainnet.log',
    'logs/security/security.log',
    'logs/performance/metrics.log'
  ];

  logFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024 * 1024);
      
      if (fileSizeInMB > 10) {
        logger.warn('Log file size exceeded 10MB', { file: filePath, size: fileSizeInMB });
      }
    }
  });
};

// Configurar limpieza automática cada hora
if (process.env.NODE_ENV === 'production') {
  setInterval(cleanupOldLogs, 60 * 60 * 1000); // 1 hora
}

export default logger;
