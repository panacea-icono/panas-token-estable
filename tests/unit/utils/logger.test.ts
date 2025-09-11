import { logger, createLogger, LogLevel } from '../../../src/utils/logger.js'
import fs from 'fs'
import path from 'path'

// Mock de fs
jest.mock('fs')
const mockedFs = fs as jest.Mocked<typeof fs>

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock de fs.existsSync para simular que los directorios existen
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.mkdirSync.mockImplementation(() => '')
  })

  describe('createLogger', () => {
    it('should create logger with default configuration', () => {
      const testLogger = createLogger('test')
      
      expect(testLogger).toBeDefined()
      expect(testLogger.level).toBe('info')
    })

    it('should create logger with custom configuration', () => {
      const config = {
        level: 'debug' as LogLevel,
        filename: 'test.log',
        maxSize: '10m',
        maxFiles: 5
      }
      
      const testLogger = createLogger('test', config)
      
      expect(testLogger).toBeDefined()
      expect(testLogger.level).toBe('debug')
    })

    it('should handle invalid log level', () => {
      const config = {
        level: 'invalid' as LogLevel
      }
      
      const testLogger = createLogger('test', config)
      
      expect(testLogger).toBeDefined()
      expect(testLogger.level).toBe('info') // Should fallback to default
    })
  })

  describe('Logger methods', () => {
    let testLogger: any

    beforeEach(() => {
      testLogger = createLogger('test')
    })

    it('should log info messages', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      testLogger.info('Test info message')
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should log error messages', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      testLogger.error('Test error message')
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should log warning messages', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      testLogger.warn('Test warning message')
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should log debug messages', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      testLogger.debug('Test debug message')
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Logger with file transport', () => {
    it('should create file transport when filename is provided', () => {
      const config = {
        filename: 'test.log',
        level: 'info' as LogLevel
      }
      
      const testLogger = createLogger('test', config)
      
      expect(testLogger).toBeDefined()
      expect(mockedFs.existsSync).toHaveBeenCalled()
    })

    it('should handle file creation errors gracefully', () => {
      mockedFs.existsSync.mockReturnValue(false)
      mockedFs.mkdirSync.mockImplementation(() => {
        throw new Error('Permission denied')
      })
      
      const config = {
        filename: 'test.log',
        level: 'info' as LogLevel
      }
      
      // Should not throw error
      expect(() => createLogger('test', config)).not.toThrow()
    })
  })

  describe('Logger formatting', () => {
    it('should format log messages correctly', () => {
      const testLogger = createLogger('test')
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      testLogger.info('Test message', { key: 'value' })
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test message')
      )
      
      consoleSpy.mockRestore()
    })

    it('should include timestamp in log messages', () => {
      const testLogger = createLogger('test')
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      testLogger.info('Test message')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Logger levels', () => {
    it('should respect log level filtering', () => {
      const config = {
        level: 'warn' as LogLevel
      }
      
      const testLogger = createLogger('test', config)
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      testLogger.info('This should not be logged')
      testLogger.warn('This should be logged')
      
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('This should be logged')
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Logger error handling', () => {
    it('should handle logger creation errors', () => {
      // Mock error in logger creation
      jest.spyOn(console, 'error').mockImplementation()
      
      const config = {
        level: 'invalid' as LogLevel,
        filename: 'invalid/path/test.log'
      }
      
      // Should not throw error
      expect(() => createLogger('test', config)).not.toThrow()
    })

    it('should handle log writing errors', () => {
      const testLogger = createLogger('test')
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      // Mock error in log writing
      testLogger.error('Test error message')
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Default logger', () => {
    it('should export default logger', () => {
      expect(logger).toBeDefined()
      expect(logger.info).toBeDefined()
      expect(logger.error).toBeDefined()
      expect(logger.warn).toBeDefined()
      expect(logger.debug).toBeDefined()
    })

    it('should use default logger methods', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      logger.info('Test message')
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
