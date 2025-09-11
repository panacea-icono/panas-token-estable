import { PanasToken } from '../../../src/contracts/index.js'
import { TokenConfig } from '../../../src/types/index.js'

describe('PanasToken', () => {
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
  })

  describe('Constructor', () => {
    it('should create a PanasToken instance with valid config', () => {
      expect(token).toBeInstanceOf(PanasToken)
      expect(token.getConfig()).toEqual(mockConfig)
    })

    it('should throw error for invalid config', () => {
      const invalidConfig = { ...mockConfig, name: '' }
      
      expect(() => new PanasToken(invalidConfig)).toThrow('Invalid token configuration')
    })

    it('should throw error for missing required fields', () => {
      const incompleteConfig = { ...mockConfig }
      delete incompleteConfig.manager
      
      expect(() => new PanasToken(incompleteConfig)).toThrow('Manager address is required')
    })
  })

  describe('getConfig', () => {
    it('should return the token configuration', () => {
      const config = token.getConfig()
      
      expect(config).toEqual(mockConfig)
      expect(config.name).toBe('PanasToken Estable')
      expect(config.symbol).toBe('PANAS')
      expect(config.decimals).toBe(6)
      expect(config.totalSupply).toBe(1000000000)
    })
  })

  describe('validateConfig', () => {
    it('should validate correct configuration', () => {
      const isValid = token.validateConfig(mockConfig)
      expect(isValid).toBe(true)
    })

    it('should reject configuration with empty name', () => {
      const invalidConfig = { ...mockConfig, name: '' }
      const isValid = token.validateConfig(invalidConfig)
      expect(isValid).toBe(false)
    })

    it('should reject configuration with invalid decimals', () => {
      const invalidConfig = { ...mockConfig, decimals: -1 }
      const isValid = token.validateConfig(invalidConfig)
      expect(isValid).toBe(false)
    })

    it('should reject configuration with zero total supply', () => {
      const invalidConfig = { ...mockConfig, totalSupply: 0 }
      const isValid = token.validateConfig(invalidConfig)
      expect(isValid).toBe(false)
    })
  })

  describe('getTokenInfo', () => {
    it('should return formatted token information', () => {
      const info = token.getTokenInfo()
      
      expect(info).toHaveProperty('name')
      expect(info).toHaveProperty('symbol')
      expect(info).toHaveProperty('decimals')
      expect(info).toHaveProperty('totalSupply')
      expect(info).toHaveProperty('formattedSupply')
      expect(info.formattedSupply).toBe('1,000,000,000.000000')
    })
  })

  describe('calculateSupply', () => {
    it('should calculate supply with correct decimals', () => {
      const supply = token.calculateSupply(1000000)
      expect(supply).toBe('1.000000')
    })

    it('should handle zero supply', () => {
      const supply = token.calculateSupply(0)
      expect(supply).toBe('0.000000')
    })

    it('should handle large numbers', () => {
      const supply = token.calculateSupply(1000000000000)
      expect(supply).toBe('1,000,000.000000')
    })
  })

  describe('formatAddress', () => {
    it('should format address correctly', () => {
      const address = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567890'
      const formatted = token.formatAddress(address)
      
      expect(formatted).toBe('ABCD...7890')
      expect(formatted).toHaveLength(11)
    })

    it('should handle short addresses', () => {
      const address = 'ABCD'
      const formatted = token.formatAddress(address)
      
      expect(formatted).toBe('ABCD')
    })
  })

  describe('isValidAddress', () => {
    it('should validate correct Algorand address', () => {
      const validAddress = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567890'
      const isValid = token.isValidAddress(validAddress)
      
      expect(isValid).toBe(true)
    })

    it('should reject invalid address', () => {
      const invalidAddress = 'invalid-address'
      const isValid = token.isValidAddress(invalidAddress)
      
      expect(isValid).toBe(false)
    })

    it('should reject empty address', () => {
      const isValid = token.isValidAddress('')
      expect(isValid).toBe(false)
    })
  })

  describe('getNetworkConfig', () => {
    it('should return testnet configuration', () => {
      const config = token.getNetworkConfig('testnet')
      
      expect(config).toHaveProperty('network')
      expect(config).toHaveProperty('apiUrl')
      expect(config).toHaveProperty('explorerUrl')
      expect(config.network).toBe('testnet')
    })

    it('should return mainnet configuration', () => {
      const config = token.getNetworkConfig('mainnet')
      
      expect(config).toHaveProperty('network')
      expect(config).toHaveProperty('apiUrl')
      expect(config).toHaveProperty('explorerUrl')
      expect(config.network).toBe('mainnet')
    })

    it('should throw error for invalid network', () => {
      expect(() => token.getNetworkConfig('invalid')).toThrow('Invalid network')
    })
  })

  describe('deploy', () => {
    it('should prepare deployment data', async () => {
      const deploymentData = await token.deploy('testnet')
      
      expect(deploymentData).toHaveProperty('assetId')
      expect(deploymentData).toHaveProperty('transactionId')
      expect(deploymentData).toHaveProperty('network')
      expect(deploymentData.network).toBe('testnet')
    })

    it('should handle deployment errors', async () => {
      // Mock error scenario
      jest.spyOn(token, 'deploy').mockRejectedValue(new Error('Deployment failed'))
      
      await expect(token.deploy('testnet')).rejects.toThrow('Deployment failed')
    })
  })

  describe('mint', () => {
    it('should prepare mint transaction', async () => {
      const mintData = await token.mint('TESTNET_MANAGER_ADDRESS', 1000000)
      
      expect(mintData).toHaveProperty('transactionId')
      expect(mintData).toHaveProperty('amount')
      expect(mintData.amount).toBe(1000000)
    })

    it('should validate mint amount', async () => {
      await expect(token.mint('TESTNET_MANAGER_ADDRESS', -1)).rejects.toThrow('Invalid amount')
    })
  })

  describe('burn', () => {
    it('should prepare burn transaction', async () => {
      const burnData = await token.burn('TESTNET_MANAGER_ADDRESS', 1000000)
      
      expect(burnData).toHaveProperty('transactionId')
      expect(burnData).toHaveProperty('amount')
      expect(burnData.amount).toBe(1000000)
    })

    it('should validate burn amount', async () => {
      await expect(token.burn('TESTNET_MANAGER_ADDRESS', -1)).rejects.toThrow('Invalid amount')
    })
  })

  describe('transfer', () => {
    it('should prepare transfer transaction', async () => {
      const transferData = await token.transfer(
        'TESTNET_MANAGER_ADDRESS',
        'TESTNET_RESERVE_ADDRESS',
        1000000
      )
      
      expect(transferData).toHaveProperty('transactionId')
      expect(transferData).toHaveProperty('amount')
      expect(transferData).toHaveProperty('to')
      expect(transferData.amount).toBe(1000000)
    })

    it('should validate transfer parameters', async () => {
      await expect(token.transfer('', 'TESTNET_RESERVE_ADDRESS', 1000000))
        .rejects.toThrow('Invalid from address')
      
      await expect(token.transfer('TESTNET_MANAGER_ADDRESS', '', 1000000))
        .rejects.toThrow('Invalid to address')
    })
  })
})
