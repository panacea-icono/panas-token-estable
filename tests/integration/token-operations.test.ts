import { PanasToken } from '../../src/contracts/index.js'
import { TokenConfig } from '../../src/types/index.js'
import { ApiClient } from '../../src/api/index.js'

// Mock de fetch para tests de integración
global.fetch = jest.fn()

describe('Token Operations Integration', () => {
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

  describe('Token Deployment Flow', () => {
    it('should complete full deployment process', async () => {
      // Mock API responses
      const mockDeployResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          assetId: '123456789',
          transactionId: 'tx_123456789',
          network: 'testnet'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockDeployResponse)

      // Deploy token
      const deploymentResult = await token.deploy('testnet')
      
      expect(deploymentResult).toHaveProperty('assetId')
      expect(deploymentResult).toHaveProperty('transactionId')
      expect(deploymentResult).toHaveProperty('network')
      expect(deploymentResult.network).toBe('testnet')
    })

    it('should handle deployment API errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockErrorResponse)

      await expect(token.deploy('testnet')).rejects.toThrow()
    })
  })

  describe('Token Minting Flow', () => {
    it('should complete minting process with API integration', async () => {
      const mockMintResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_mint_123456789',
          amount: 1000000,
          to: 'TESTNET_MANAGER_ADDRESS'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockMintResponse)

      const mintResult = await token.mint('TESTNET_MANAGER_ADDRESS', 1000000)
      
      expect(mintResult).toHaveProperty('transactionId')
      expect(mintResult).toHaveProperty('amount')
      expect(mintResult.amount).toBe(1000000)
    })

    it('should validate minting parameters', async () => {
      await expect(token.mint('', 1000000)).rejects.toThrow('Invalid address')
      await expect(token.mint('TESTNET_MANAGER_ADDRESS', -1)).rejects.toThrow('Invalid amount')
      await expect(token.mint('TESTNET_MANAGER_ADDRESS', 0)).rejects.toThrow('Invalid amount')
    })
  })

  describe('Token Burning Flow', () => {
    it('should complete burning process with API integration', async () => {
      const mockBurnResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_burn_123456789',
          amount: 500000,
          from: 'TESTNET_MANAGER_ADDRESS'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockBurnResponse)

      const burnResult = await token.burn('TESTNET_MANAGER_ADDRESS', 500000)
      
      expect(burnResult).toHaveProperty('transactionId')
      expect(burnResult).toHaveProperty('amount')
      expect(burnResult.amount).toBe(500000)
    })

    it('should validate burning parameters', async () => {
      await expect(token.burn('', 500000)).rejects.toThrow('Invalid address')
      await expect(token.burn('TESTNET_MANAGER_ADDRESS', -1)).rejects.toThrow('Invalid amount')
    })
  })

  describe('Token Transfer Flow', () => {
    it('should complete transfer process with API integration', async () => {
      const mockTransferResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_transfer_123456789',
          amount: 250000,
          from: 'TESTNET_MANAGER_ADDRESS',
          to: 'TESTNET_RESERVE_ADDRESS'
        })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockTransferResponse)

      const transferResult = await token.transfer(
        'TESTNET_MANAGER_ADDRESS',
        'TESTNET_RESERVE_ADDRESS',
        250000
      )
      
      expect(transferResult).toHaveProperty('transactionId')
      expect(transferResult).toHaveProperty('amount')
      expect(transferResult).toHaveProperty('from')
      expect(transferResult).toHaveProperty('to')
      expect(transferResult.amount).toBe(250000)
    })

    it('should validate transfer parameters', async () => {
      await expect(token.transfer('', 'TESTNET_RESERVE_ADDRESS', 250000))
        .rejects.toThrow('Invalid from address')
      
      await expect(token.transfer('TESTNET_MANAGER_ADDRESS', '', 250000))
        .rejects.toThrow('Invalid to address')
      
      await expect(token.transfer('TESTNET_MANAGER_ADDRESS', 'TESTNET_RESERVE_ADDRESS', -1))
        .rejects.toThrow('Invalid amount')
    })
  })

  describe('API Client Integration', () => {
    it('should handle successful API calls', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true, data: 'test' })
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiClient.get('/test')
      
      expect(result.success).toBe(true)
      expect(result.data).toBe('test')
    })

    it('should handle API errors gracefully', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockErrorResponse)

      const result = await apiClient.get('/not-found')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('404 Not Found')
    })
  })

  describe('End-to-End Token Operations', () => {
    it('should complete full token lifecycle', async () => {
      // Mock all API responses
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
            amount: 1000000,
            to: 'TESTNET_MANAGER_ADDRESS'
          })
        },
        // Transfer
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            transactionId: 'tx_transfer_123456789',
            amount: 500000,
            from: 'TESTNET_MANAGER_ADDRESS',
            to: 'TESTNET_RESERVE_ADDRESS'
          })
        },
        // Burn
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            transactionId: 'tx_burn_123456789',
            amount: 250000,
            from: 'TESTNET_MANAGER_ADDRESS'
          })
        }
      ]
      
      ;(fetch as jest.Mock).mockImplementation(() => 
        Promise.resolve(mockResponses.shift())
      )

      // Deploy token
      const deployResult = await token.deploy('testnet')
      expect(deployResult.assetId).toBe('123456789')

      // Mint tokens
      const mintResult = await token.mint('TESTNET_MANAGER_ADDRESS', 1000000)
      expect(mintResult.amount).toBe(1000000)

      // Transfer tokens
      const transferResult = await token.transfer(
        'TESTNET_MANAGER_ADDRESS',
        'TESTNET_RESERVE_ADDRESS',
        500000
      )
      expect(transferResult.amount).toBe(500000)

      // Burn tokens
      const burnResult = await token.burn('TESTNET_MANAGER_ADDRESS', 250000)
      expect(burnResult.amount).toBe(250000)
    })

    it('should handle partial failures gracefully', async () => {
      // Mock deploy success, mint failure
      const mockDeployResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          assetId: '123456789',
          transactionId: 'tx_deploy_123456789',
          network: 'testnet'
        })
      }
      
      const mockMintErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce(mockDeployResponse)
        .mockResolvedValueOnce(mockMintErrorResponse)

      // Deploy should succeed
      const deployResult = await token.deploy('testnet')
      expect(deployResult.assetId).toBe('123456789')

      // Mint should fail
      await expect(token.mint('TESTNET_MANAGER_ADDRESS', 1000000)).rejects.toThrow()
    })
  })

  describe('Error Recovery', () => {
    it('should retry failed operations', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      
      const mockSuccessResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          transactionId: 'tx_retry_123456789',
          amount: 1000000,
          to: 'TESTNET_MANAGER_ADDRESS'
        })
      }
      
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce(mockErrorResponse)
        .mockResolvedValueOnce(mockSuccessResponse)

      // First attempt should fail, second should succeed
      const result = await token.mint('TESTNET_MANAGER_ADDRESS', 1000000)
      expect(result.transactionId).toBe('tx_retry_123456789')
    })
  })
})
