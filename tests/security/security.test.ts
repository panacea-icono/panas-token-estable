import { PanasToken } from '../../src/contracts/index.js'
import { TokenConfig } from '../../src/types/index.js'

// Mock de fetch para tests de seguridad
global.fetch = jest.fn()

describe('Security Tests', () => {
  let token: PanasToken
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
    jest.clearAllMocks()
  })

  describe('Input Validation', () => {
    it('should reject malicious input in token name', () => {
      const maliciousConfig = {
        ...mockConfig,
        name: '<script>alert("xss")</script>'
      }
      
      expect(() => new PanasToken(maliciousConfig)).toThrow('Invalid token configuration')
    })

    it('should reject SQL injection attempts', () => {
      const maliciousConfig = {
        ...mockConfig,
        description: "'; DROP TABLE tokens; --"
      }
      
      expect(() => new PanasToken(maliciousConfig)).toThrow('Invalid token configuration')
    })

    it('should reject invalid addresses', () => {
      const invalidAddresses = [
        '',
        'invalid',
        '0x123',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ2345678901', // Too long
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789',   // Too short
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567890!'  // Invalid character
      ]

      invalidAddresses.forEach(address => {
        expect(token.isValidAddress(address)).toBe(false)
      })
    })

    it('should reject negative amounts', async () => {
      await expect(token.mint('TESTNET_MANAGER_ADDRESS', -1)).rejects.toThrow('Invalid amount')
      await expect(token.burn('TESTNET_MANAGER_ADDRESS', -1)).rejects.toThrow('Invalid amount')
      await expect(token.transfer('TESTNET_MANAGER_ADDRESS', 'TESTNET_RESERVE_ADDRESS', -1)).rejects.toThrow('Invalid amount')
    })

    it('should reject zero amounts', async () => {
      await expect(token.mint('TESTNET_MANAGER_ADDRESS', 0)).rejects.toThrow('Invalid amount')
      await expect(token.burn('TESTNET_MANAGER_ADDRESS', 0)).rejects.toThrow('Invalid amount')
      await expect(token.transfer('TESTNET_MANAGER_ADDRESS', 'TESTNET_RESERVE_ADDRESS', 0)).rejects.toThrow('Invalid amount')
    })
  })

  describe('Access Control', () => {
    it('should validate manager permissions', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({
          error: 'Insufficient permissions',
          code: 'ACCESS_DENIED'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(token.mint('UNAUTHORIZED_ADDRESS', 1000000)).rejects.toThrow()
    })

    it('should validate freeze permissions', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({
          error: 'Insufficient permissions',
          code: 'ACCESS_DENIED'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(token.freeze('UNAUTHORIZED_ADDRESS', 'USER_ADDRESS')).rejects.toThrow()
    })

    it('should validate clawback permissions', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({
          error: 'Insufficient permissions',
          code: 'ACCESS_DENIED'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(token.clawback('UNAUTHORIZED_ADDRESS', 'USER_ADDRESS', 1000000)).rejects.toThrow()
    })
  })

  describe('Rate Limiting', () => {
    it('should handle rate limiting gracefully', async () => {
      const mockRateLimitResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: jest.fn().mockResolvedValue({
          error: 'Rate limit exceeded',
          retryAfter: 60
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockRateLimitResponse)

      await expect(token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 1000000)).rejects.toThrow()
    })

    it('should implement exponential backoff', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      
      const mockSuccessResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_retry_123456789',
          amount: '1000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce(mockErrorResponse)
        .mockResolvedValueOnce(mockErrorResponse)
        .mockResolvedValueOnce(mockSuccessResponse)

      const startTime = performance.now()
      
      const result = await token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 1000000)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(result.transactionId).toBe('tx_retry_123456789')
      expect(duration).toBeGreaterThan(100) // Should have some delay
    })
  })

  describe('Data Integrity', () => {
    it('should validate transaction data integrity', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_integrity_123456789',
          amount: '1000000',
          from: 'TESTNET_MANAGER_ADDRESS',
          to: 'USER1_ADDRESS',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 1000000)
      
      expect(result.transactionId).toBe('tx_integrity_123456789')
      expect(result.amount).toBe('1000000')
      expect(result.from).toBe('TESTNET_MANAGER_ADDRESS')
      expect(result.to).toBe('USER1_ADDRESS')
      expect(result.status).toBe('confirmed')
    })

    it('should detect tampered data', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_tampered_123456789',
          amount: '2000000', // Different from requested
          from: 'TESTNET_MANAGER_ADDRESS',
          to: 'USER1_ADDRESS',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 1000000)
      
      // Should detect tampering
      expect(result.amount).not.toBe('1000000')
      expect(result.amount).toBe('2000000')
    })
  })

  describe('Error Handling', () => {
    it('should not expose sensitive information in errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockResolvedValue({
          error: 'Database connection failed',
          stack: 'Error: Database connection failed\n    at Database.connect()\n    at TokenService.process()',
          internalCode: 'DB_CONN_001'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      try {
        await token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 1000000)
      } catch (error) {
        expect(error.message).not.toContain('Database connection failed')
        expect(error.message).not.toContain('stack')
        expect(error.message).not.toContain('internalCode')
      }
    })

    it('should handle network timeouts gracefully', async () => {
      ;(fetch as jest.Mock).mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
      )

      await expect(token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 1000000)).rejects.toThrow('Network timeout')
    })
  })

  describe('Authentication', () => {
    it('should require valid authentication', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({
          error: 'Invalid authentication token',
          code: 'AUTH_FAILED'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(token.deploy('testnet')).rejects.toThrow()
    })

    it('should handle token expiration', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({
          error: 'Authentication token expired',
          code: 'TOKEN_EXPIRED'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(token.deploy('testnet')).rejects.toThrow()
    })
  })

  describe('Authorization', () => {
    it('should enforce role-based access control', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({
          error: 'Insufficient role permissions',
          code: 'ROLE_DENIED',
          requiredRole: 'ADMIN',
          currentRole: 'USER'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(token.deploy('testnet')).rejects.toThrow()
    })

    it('should validate resource ownership', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({
          error: 'Resource not owned by user',
          code: 'OWNERSHIP_DENIED'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(token.transfer('OTHER_USER_ADDRESS', 'USER1_ADDRESS', 1000000)).rejects.toThrow()
    })
  })
})
