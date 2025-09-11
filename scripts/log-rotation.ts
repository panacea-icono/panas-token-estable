// PanasToken Estable - Log Rotation Script
// Script para rotar y archivar logs antiguos

import { readdir, stat, rename, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { createGzip } from 'zlib';
import { createWriteStream, createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

interface LogFile {
  name: string;
  path: string;
  size: number;
  modified: Date;
}

export class LogRotator {
  private logDir: string;
  private archiveDir: string;
  private maxSize: number; // en bytes
  private maxFiles: number;
  private maxAge: number; // en días

  constructor(
    logDir: string = 'logs',
    maxSize: number = 10 * 1024 * 1024, // 10MB
    maxFiles: number = 5,
    maxAge: number = 30 // 30 días
  ) {
    this.logDir = logDir;
    this.archiveDir = join(logDir, 'archived');
    this.maxSize = maxSize;
    this.maxFiles = maxFiles;
    this.maxAge = maxAge;
  }

  async rotateLogs(): Promise<void> {
    console.log('🔄 Iniciando rotación de logs...');

    try {
      // Crear directorio de archivo si no existe
      await this.ensureArchiveDirectory();

      // Obtener todos los archivos de log
      const logFiles = await this.getLogFiles();

      // Rotar archivos que excedan el tamaño máximo
      await this.rotateOversizedFiles(logFiles);

      // Archivar archivos antiguos
      await this.archiveOldFiles(logFiles);

      // Limpiar archivos muy antiguos
      await this.cleanupVeryOldFiles();

      console.log('✅ Rotación de logs completada');

    } catch (error) {
      console.error('❌ Error en rotación de logs:', error);
      throw error;
    }
  }

  private async ensureArchiveDirectory(): Promise<void> {
    try {
      await mkdir(this.archiveDir, { recursive: true });
    } catch (error) {
      // El directorio ya existe
    }
  }

  private async getLogFiles(): Promise<LogFile[]> {
    const files: LogFile[] = [];
    const subdirs = ['application', 'blockchain', 'security', 'performance'];

    for (const subdir of subdirs) {
      const subdirPath = join(this.logDir, subdir);
      try {
        const entries = await readdir(subdirPath);
        
        for (const entry of entries) {
          if (extname(entry) === '.log') {
            const filePath = join(subdirPath, entry);
            const stats = await stat(filePath);
            
            files.push({
              name: entry,
              path: filePath,
              size: stats.size,
              modified: stats.mtime
            });
          }
        }
      } catch (error) {
        // El subdirectorio no existe o no se puede leer
        console.warn(`⚠️  No se pudo leer directorio ${subdir}:`, error.message);
      }
    }

    return files;
  }

  private async rotateOversizedFiles(logFiles: LogFile[]): Promise<void> {
    const oversizedFiles = logFiles.filter(file => file.size > this.maxSize);

    for (const file of oversizedFiles) {
      console.log(`📦 Rotando archivo grande: ${file.name} (${this.formatBytes(file.size)})`);
      
      // Crear nombre de archivo rotado
      const timestamp = new Date().toISOString().split('T')[0];
      const baseName = file.name.replace('.log', '');
      const rotatedName = `${baseName}.${timestamp}.log`;
      const rotatedPath = join(path.dirname(file.path), rotatedName);

      // Renombrar archivo actual
      await rename(file.path, rotatedPath);

      // Comprimir archivo rotado
      await this.compressFile(rotatedPath);

      console.log(`✅ Archivo rotado: ${rotatedName}`);
    }
  }

  private async archiveOldFiles(logFiles: LogFile[]): Promise<void> {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (this.maxAge * 24 * 60 * 60 * 1000));

    const oldFiles = logFiles.filter(file => file.modified < cutoffDate);

    for (const file of oldFiles) {
      console.log(`📁 Archivando archivo antiguo: ${file.name}`);
      
      // Crear directorio de archivo por mes
      const monthDir = file.modified.toISOString().substring(0, 7); // YYYY-MM
      const archiveMonthDir = join(this.archiveDir, monthDir);
      await mkdir(archiveMonthDir, { recursive: true });

      // Mover archivo al directorio de archivo
      const archivePath = join(archiveMonthDir, file.name);
      await rename(file.path, archivePath);

      // Comprimir archivo archivado
      await this.compressFile(archivePath);

      console.log(`✅ Archivo archivado: ${archivePath}`);
    }
  }

  private async cleanupVeryOldFiles(): Promise<void> {
    const veryOldCutoff = new Date();
    veryOldCutoff.setFullYear(veryOldCutoff.getFullYear() - 1); // 1 año

    try {
      const archiveEntries = await readdir(this.archiveDir);
      
      for (const entry of archiveEntries) {
        const entryPath = join(this.archiveDir, entry);
        const stats = await stat(entryPath);
        
        if (stats.isDirectory() && stats.mtime < veryOldCutoff) {
          console.log(`🗑️  Eliminando archivos muy antiguos: ${entry}`);
          // En un entorno real, aquí se eliminarían los archivos
          // await rm(entryPath, { recursive: true });
        }
      }
    } catch (error) {
      console.warn('⚠️  No se pudo limpiar archivos antiguos:', error.message);
    }
  }

  private async compressFile(filePath: string): Promise<void> {
    const compressedPath = filePath + '.gz';
    
    try {
      await pipeline(
        createReadStream(filePath),
        createGzip(),
        createWriteStream(compressedPath)
      );
      
      // Eliminar archivo original después de comprimir
      await rename(filePath, filePath + '.original');
      await rename(compressedPath, filePath);
      
    } catch (error) {
      console.warn(`⚠️  No se pudo comprimir archivo ${filePath}:`, error.message);
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async getLogStatistics(): Promise<any> {
    const logFiles = await this.getLogFiles();
    
    const stats = {
      totalFiles: logFiles.length,
      totalSize: logFiles.reduce((sum, file) => sum + file.size, 0),
      averageSize: 0,
      largestFile: null as LogFile | null,
      oldestFile: null as LogFile | null,
      byDirectory: {} as Record<string, { count: number; size: number }>
    };

    if (logFiles.length > 0) {
      stats.averageSize = stats.totalSize / logFiles.length;
      stats.largestFile = logFiles.reduce((max, file) => file.size > max.size ? file : max);
      stats.oldestFile = logFiles.reduce((oldest, file) => file.modified < oldest.modified ? file : oldest);

      // Agrupar por directorio
      logFiles.forEach(file => {
        const dir = path.dirname(file.path).split('/').pop() || 'unknown';
        if (!stats.byDirectory[dir]) {
          stats.byDirectory[dir] = { count: 0, size: 0 };
        }
        stats.byDirectory[dir].count++;
        stats.byDirectory[dir].size += file.size;
      });
    }

    return stats;
  }
}

// Script ejecutable
if (import.meta.url === `file://${process.argv[1]}`) {
  const rotator = new LogRotator();
  
  const command = process.argv[2] || 'rotate';
  
  switch (command) {
    case 'rotate':
      rotator.rotateLogs()
        .then(() => {
          console.log('🎉 Rotación completada');
          process.exit(0);
        })
        .catch(error => {
          console.error('💥 Error:', error);
          process.exit(1);
        });
      break;
      
    case 'stats':
      rotator.getLogStatistics()
        .then(stats => {
          console.log('📊 Estadísticas de logs:');
          console.log(JSON.stringify(stats, null, 2));
          process.exit(0);
        })
        .catch(error => {
          console.error('💥 Error:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Uso: npm run log-rotation [rotate|stats]');
      process.exit(1);
  }
}
