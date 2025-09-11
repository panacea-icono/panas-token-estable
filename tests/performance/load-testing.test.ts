import { PanasToken } from '../../src/contracts/index.js'
import { TokenConfig } from '../../src/types/index.js'
import { ApiClient } from '../../src/api/index.js'

// Mock de fetch para tests de performance
global.fetch = jest.fn()

describe('Performance and Load Testing', () => {
  let token: PanasToken
  let apiClient: ApiClient
  let mockConfig: TokenConfig

  beforeEach(() => {
    mockConfig = {
      name: 'PanasToken Estable',
      symbol: 'PANAS',
      decimals: 6,
      totalSupply: 1000000000,
      description: 'Token estable del ecosistema PANAS',
      url: 'https://github.com/panacea-icono/panas-token-estable',
      manager: 'TESTNET_MANAGER_ADDRESS',
      reserve: 'TESTNET_RESERVE_ADDRESS',
      freeze: 'TESTNET_FREEZE_ADDRESS',
      clawback: 'TESTNET_CLAWBACK_ADDRESS'
    }
    
    token = new PanasToken(mockConfig)
    apiClient = new ApiClient('https://api.panas-token.com')
    
    jest.clearAllMocks()
  })

  describe('Response Time Tests', () => {
    it('should complete single operation within acceptable time', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_perf_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const startTime = performance.now()
      
      await token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 100000000000)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should complete within 100ms (mocked)
      expect(duration).toBeLessThan(100)
      console.log(`✅ Single operation completed in ${duration.toFixed(2)}ms`)
    })

    it('should handle multiple operations efficiently', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_perf_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const startTime = performance.now()
      
      // Simulate 10 concurrent operations
      const operations = Array.from({ length: 10 }, (_, i) => 
        token.transfer('TESTNET_MANAGER_ADDRESS', `USER${i}_ADDRESS`, 100000000000)
      )

      await Promise.all(operations)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should complete within 500ms
      expect(duration).toBeLessThan(500)
      console.log(`✅ 10 concurrent operations completed in ${duration.toFixed(2)}ms`)
    })
  })

  describe('Memory Usage Tests', () => {
    it('should not leak memory during operations', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_memory_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const initialMemory = process.memoryUsage().heapUsed
      
      // Perform 100 operations
      for (let i = 0; i < 100; i++) {
        await token.transfer('TESTNET_MANAGER_ADDRESS', `USER${i}_ADDRESS`, 100000000000)
      }
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
      console.log(`✅ Memory usage increased by ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`)
    })

    it('should handle large data sets efficiently', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_large_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const startTime = performance.now()
      
      // Simulate large number of operations
      const operations = Array.from({ length: 1000 }, (_, i) => 
        token.transfer('TESTNET_MANAGER_ADDRESS', `USER${i}_ADDRESS`, 100000000000)
      )

      await Promise.all(operations)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should complete within 2 seconds
      expect(duration).toBeLessThan(2000)
      console.log(`✅ 1000 operations completed in ${duration.toFixed(2)}ms`)
    })
  })

  describe('Concurrent Load Tests', () => {
    it('should handle high concurrent load', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_concurrent_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const startTime = performance.now()
      
      // Simulate 50 concurrent operations
      const operations = Array.from({ length: 50 }, (_, i) => 
        token.transfer('TESTNET_MANAGER_ADDRESS', `USER${i}_ADDRESS`, 100000000000)
      )

      const results = await Promise.all(operations)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // All operations should succeed
      expect(results).toHaveLength(50)
      results.forEach(result => {
        expect(result.transactionId).toBe('tx_concurrent_123456789')
        expect(result.status).toBe('confirmed')
      })
      
      // Should complete within 1 second
      expect(duration).toBeLessThan(1000)
      console.log(`✅ 50 concurrent operations completed in ${duration.toFixed(2)}ms`)
    })

    it('should handle mixed operation types concurrently', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_mixed_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const startTime = performance.now()
      
      // Mix of different operations
      const operations = [
        // Transfers
        ...Array.from({ length: 10 }, (_, i) => 
          token.transfer('TESTNET_MANAGER_ADDRESS', `USER${i}_ADDRESS`, 100000000000)
        ),
        // Mints
        ...Array.from({ length: 5 }, (_, i) => 
          token.mint(`USER${i}_ADDRESS`, 100000000000)
        ),
        // Burns
        ...Array.from({ length: 5 }, (_, i) => 
          token.burn(`USER${i}_ADDRESS`, 50000000000)
        )
      ]

      const results = await Promise.all(operations)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // All operations should succeed
      expect(results).toHaveLength(20)
      results.forEach(result => {
        expect(result.transactionId).toBe('tx_mixed_123456789')
        expect(result.status).toBe('confirmed')
      })
      
      // Should complete within 1 second
      expect(duration).toBeLessThan(1000)
      console.log(`✅ 20 mixed operations completed in ${duration.toFixed(2)}ms`)
    })
  })

  describe('Error Recovery Performance', () => {
    it('should recover from errors quickly', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      
      const mockSuccessResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_recovery_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce(mockErrorResponse)
        .mockResolvedValueOnce(mockSuccessResponse)

      const startTime = performance.now()
      
      // First attempt should fail, second should succeed
      const result = await token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 100000000000)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(result.transactionId).toBe('tx_recovery_123456789')
      expect(result.status).toBe('confirmed')
      
      // Should recover within 200ms
      expect(duration).toBeLessThan(200)
      console.log(`✅ Error recovery completed in ${duration.toFixed(2)}ms`)
    })
  })

  describe('Scalability Tests', () => {
    it('should scale linearly with operation count', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_scale_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const testSizes = [10, 50, 100, 200]
      const results = []

      for (const size of testSizes) {
        const startTime = performance.now()
        
        const operations = Array.from({ length: size }, (_, i) => 
          token.transfer('TESTNET_MANAGER_ADDRESS', `USER${i}_ADDRESS`, 100000000000)
        )

        await Promise.all(operations)
        
        const endTime = performance.now()
        const duration = endTime - startTime
        
        results.push({ size, duration })
        console.log(`✅ ${size} operations completed in ${duration.toFixed(2)}ms`)
      }

      // Verify linear scaling (within reasonable bounds)
      for (let i = 1; i < results.length; i++) {
        const ratio = results[i].duration / results[i-1].duration
        const sizeRatio = results[i].size / results[i-1].size
        
        // Duration should scale roughly with size
        expect(ratio).toBeLessThan(sizeRatio * 1.5) // Allow 50% overhead
      }
    })
  })

  describe('Resource Usage Tests', () => {
    it('should maintain consistent resource usage', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_resource_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const measurements = []

      // Measure resource usage over time
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now()
        const startMemory = process.memoryUsage().heapUsed
        
        await token.transfer('TESTNET_MANAGER_ADDRESS', `USER${i}_ADDRESS`, 100000000000)
        
        const endTime = performance.now()
        const endMemory = process.memoryUsage().heapUsed
        
        measurements.push({
          iteration: i,
          duration: endTime - startTime,
          memory: endMemory - startMemory
        })
      }

      // Calculate statistics
      const durations = measurements.map(m => m.duration)
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      const maxDuration = Math.max(...durations)
      const minDuration = Math.min(...durations)

      // Duration should be consistent (max should not be more than 2x average)
      expect(maxDuration).toBeLessThan(avgDuration * 2)
      expect(minDuration).toBeGreaterThan(avgDuration * 0.5)
      
      console.log(`✅ Average duration: ${avgDuration.toFixed(2)}ms`)
      console.log(`✅ Duration range: ${minDuration.toFixed(2)}ms - ${maxDuration.toFixed(2)}ms`)
    })
  })
})
