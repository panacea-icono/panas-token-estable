import { PanasToken } from '../../src/contracts/index.js'
import { TokenConfig } from '../../src/types/index.js'
import { ApiClient } from '../../src/api/index.js'

// Mock de fetch para tests E2E
global.fetch = jest.fn()

describe('Full Workflow E2E Tests', () => {
  let token: PanasToken
  let apiClient: ApiClient
  let mockConfig: TokenConfig

  beforeAll(() => {
    // Configuración global para tests E2E
    process.env.NODE_ENV = 'test'
    process.env.ALGORAND_NETWORK = 'testnet'
  })

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

  describe('Complete Token Lifecycle', () => {
    it('should handle complete token lifecycle from deployment to destruction', async () => {
      // Mock sequence of API responses
      const mockResponses = [
        // 1. Deploy token
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            assetId: '123456789',
            transactionId: 'tx_deploy_123456789',
            network: 'testnet',
            status: 'confirmed'
          })
        },
        // 2. Get token info
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            assetId: '123456789',
            name: 'PanasToken Estable',
            symbol: 'PANAS',
            decimals: 6,
            totalSupply: '1000000000000000',
            manager: 'TESTNET_MANAGER_ADDRESS',
            reserve: 'TESTNET_RESERVE_ADDRESS',
            freeze: 'TESTNET_FREEZE_ADDRESS',
            clawback: 'TESTNET_CLAWBACK_ADDRESS'
          })
        },
        // 3. Mint initial supply
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            transactionId: 'tx_mint_initial_123456789',
            amount: '1000000000000000',
            to: 'TESTNET_MANAGER_ADDRESS',
            status: 'confirmed'
          })
        },
        // 4. Transfer to reserve
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            transactionId: 'tx_transfer_reserve_123456789',
            amount: '500000000000000',
            from: 'TESTNET_MANAGER_ADDRESS',
            to: 'TESTNET_RESERVE_ADDRESS',
            status: 'confirmed'
          })
        },
        // 5. Transfer to users
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            transactionId: 'tx_transfer_user1_123456789',
            amount: '100000000000',
            from: 'TESTNET_MANAGER_ADDRESS',
            to: 'USER1_ADDRESS',
            status: 'confirmed'
          })
        },
        // 6. Transfer to users
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            transactionId: 'tx_transfer_user2_123456789',
            amount: '100000000000',
            from: 'TESTNET_MANAGER_ADDRESS',
            to: 'USER2_ADDRESS',
            status: 'confirmed'
          })
        },
        // 7. Burn excess tokens
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            transactionId: 'tx_burn_excess_123456789',
            amount: '300000000000000',
            from: 'TESTNET_MANAGER_ADDRESS',
            status: 'confirmed'
          })
        }
      ]
      
      ;(fetch as jest.Mock).mockImplementation(() => 
        Promise.resolve(mockResponses.shift())
      )

      // Step 1: Deploy token
      console.log('🚀 Step 1: Deploying token...')
      const deployResult = await token.deploy('testnet')
      expect(deployResult.assetId).toBe('123456789')
      expect(deployResult.status).toBe('confirmed')
      console.log('✅ Token deployed successfully')

      // Step 2: Get token information
      console.log('📊 Step 2: Getting token information...')
      const tokenInfo = token.getTokenInfo()
      expect(tokenInfo.name).toBe('PanasToken Estable')
      expect(tokenInfo.symbol).toBe('PANAS')
      expect(tokenInfo.decimals).toBe(6)
      console.log('✅ Token information retrieved')

      // Step 3: Mint initial supply
      console.log('💰 Step 3: Minting initial supply...')
      const mintResult = await token.mint('TESTNET_MANAGER_ADDRESS', 1000000000000000)
      expect(mintResult.amount).toBe(1000000000000000)
      expect(mintResult.status).toBe('confirmed')
      console.log('✅ Initial supply minted')

      // Step 4: Transfer to reserve
      console.log('🏦 Step 4: Transferring to reserve...')
      const reserveTransferResult = await token.transfer(
        'TESTNET_MANAGER_ADDRESS',
        'TESTNET_RESERVE_ADDRESS',
        500000000000000
      )
      expect(reserveTransferResult.amount).toBe(500000000000000)
      expect(reserveTransferResult.status).toBe('confirmed')
      console.log('✅ Reserve transfer completed')

      // Step 5: Transfer to users
      console.log('👥 Step 5: Transferring to users...')
      const user1TransferResult = await token.transfer(
        'TESTNET_MANAGER_ADDRESS',
        'USER1_ADDRESS',
        100000000000
      )
      expect(user1TransferResult.amount).toBe(100000000000)
      expect(user1TransferResult.status).toBe('confirmed')

      const user2TransferResult = await token.transfer(
        'TESTNET_MANAGER_ADDRESS',
        'USER2_ADDRESS',
        100000000000
      )
      expect(user2TransferResult.amount).toBe(100000000000)
      expect(user2TransferResult.status).toBe('confirmed')
      console.log('✅ User transfers completed')

      // Step 6: Burn excess tokens
      console.log('🔥 Step 6: Burning excess tokens...')
      const burnResult = await token.burn('TESTNET_MANAGER_ADDRESS', 300000000000000)
      expect(burnResult.amount).toBe(300000000000000)
      expect(burnResult.status).toBe('confirmed')
      console.log('✅ Excess tokens burned')

      console.log('🎉 Complete token lifecycle test passed!')
    })

    it('should handle error scenarios gracefully', async () => {
      // Mock error responses
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockResolvedValue({
          error: 'Network error',
          code: 'NETWORK_ERROR'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockErrorResponse)

      // Test error handling
      await expect(token.deploy('testnet')).rejects.toThrow()
      await expect(token.mint('TESTNET_MANAGER_ADDRESS', 1000000)).rejects.toThrow()
      await expect(token.transfer('TESTNET_MANAGER_ADDRESS', 'TESTNET_RESERVE_ADDRESS', 1000000)).rejects.toThrow()
      await expect(token.burn('TESTNET_MANAGER_ADDRESS', 1000000)).rejects.toThrow()
    })
  })

  describe('Multi-User Scenarios', () => {
    it('should handle concurrent operations', async () => {
      const mockSuccessResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_concurrent_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockSuccessResponse)

      // Simulate concurrent operations
      const operations = [
        token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 100000000000),
        token.transfer('TESTNET_MANAGER_ADDRESS', 'USER2_ADDRESS', 100000000000),
        token.transfer('TESTNET_MANAGER_ADDRESS', 'USER3_ADDRESS', 100000000000)
      ]

      const results = await Promise.all(operations)
      
      results.forEach(result => {
        expect(result.transactionId).toBe('tx_concurrent_123456789')
        expect(result.amount).toBe('100000000000')
        expect(result.status).toBe('confirmed')
      })
    })

    it('should handle rate limiting', async () => {
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

      await expect(token.transfer('TESTNET_MANAGER_ADDRESS', 'USER1_ADDRESS', 100000000000))
        .rejects.toThrow()
    })
  })

  describe('Data Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      const mockResponses = [
        // Deploy
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            assetId: '123456789',
            transactionId: 'tx_deploy_123456789',
            network: 'testnet'
          })
        },
        // Mint
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            transactionId: 'tx_mint_123456789',
            amount: '1000000000000000',
            to: 'TESTNET_MANAGER_ADDRESS'
          })
        },
        // Get balance
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            balance: '1000000000000000',
            assetId: '123456789'
          })
        },
        // Transfer
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            transactionId: 'tx_transfer_123456789',
            amount: '500000000000000',
            from: 'TESTNET_MANAGER_ADDRESS',
            to: 'TESTNET_RESERVE_ADDRESS'
          })
        },
        // Get balance after transfer
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            balance: '500000000000000',
            assetId: '123456789'
          })
        }
      ]
      
      ;(fetch as jest.Mock).mockImplementation(() => 
        Promise.resolve(mockResponses.shift())
      )

      // Deploy and mint
      await token.deploy('testnet')
      await token.mint('TESTNET_MANAGER_ADDRESS', 1000000000000000)

      // Transfer half
      await token.transfer('TESTNET_MANAGER_ADDRESS', 'TESTNET_RESERVE_ADDRESS', 500000000000000)

      // Verify balance consistency
      const balanceResponse = await apiClient.get('/balance/TESTNET_MANAGER_ADDRESS')
      expect(balanceResponse.data.balance).toBe('500000000000000')
    })
  })

  describe('Performance Tests', () => {
    it('should handle large number of operations efficiently', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_perf_123456789',
          amount: '100000000000',
          status: 'confirmed'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const startTime = Date.now()
      
      // Simulate 100 operations
      const operations = Array.from({ length: 100 }, (_, i) => 
        token.transfer('TESTNET_MANAGER_ADDRESS', `USER${i}_ADDRESS`, 100000000000)
      )

      await Promise.all(operations)
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      // Should complete within reasonable time (5 seconds)
      expect(duration).toBeLessThan(5000)
      console.log(`✅ 100 operations completed in ${duration}ms`)
    })
  })
})
