export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface Logger {
  level: LogLevel;
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export function createLogger(level: LogLevel = 'info'): Logger {
  const levels: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    silent: 99
  };
  const gate = (min: LogLevel, fn: (...a: unknown[]) => void) =>
    (...a: unknown[]) => {
      if (levels[level] <= levels[min]) fn(...a);
    };

  return {
    level,
    debug: gate('debug', console.debug.bind(console, '[debug]')),
    info: gate('info', console.info.bind(console, '[info]')),
    warn: gate('warn', console.warn.bind(console, '[warn]')),
    error: gate('error', console.error.bind(console, '[error]'))
  };
}

const defaultLogger = createLogger((process.env['LOG_LEVEL'] as LogLevel) || 'info');
export default defaultLogger;


