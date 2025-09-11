// Jest setup file
// Configuración global para todos los tests

// Mock de variables de entorno
process.env.NODE_ENV = 'test'
process.env.ALGORAND_NETWORK = 'testnet'
process.env.TESTNET_WALLET_MNEMONIC = 'test mnemonic for testing purposes only'
process.env.TESTNET_MANAGER_ADDRESS = 'TESTNET_MANAGER_ADDRESS'
process.env.TESTNET_RESERVE_ADDRESS = 'TESTNET_RESERVE_ADDRESS'
process.env.TESTNET_FREEZE_ADDRESS = 'TESTNET_FREEZE_ADDRESS'
process.env.TESTNET_CLAWBACK_ADDRESS = 'TESTNET_CLAWBACK_ADDRESS'

// Mock de console para tests
global.console = {
  ...console,
  // Silenciar console.log en tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

// Mock de process.exit
global.process.exit = jest.fn()

// Mock de setTimeout y setInterval para tests
jest.useFakeTimers()

// Mock de crypto para tests determinísticos
const crypto = require('crypto')
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID(),
    getRandomValues: (arr) => crypto.randomBytes(arr.length)
  }
})

// Mock de fetch para tests de API
global.fetch = jest.fn()

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock de sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.sessionStorage = sessionStorageMock

// Mock de window para tests del frontend
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

// Mock de IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock de MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}))

// Configuración de timeouts
jest.setTimeout(10000)

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks()
  jest.clearAllTimers()
})

// Limpiar timers después de cada test
afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  jest.useFakeTimers()
})

// Configuración de coverage
beforeAll(() => {
  // Configurar coverage si es necesario
})

afterAll(() => {
  // Limpiar recursos globales
  jest.clearAllMocks()
  jest.clearAllTimers()
})
