// Global setup para Jest
// Se ejecuta una vez antes de todos los tests

const fs = require('fs')
const path = require('path')

module.exports = async () => {
  console.log('🚀 Configurando entorno de testing global...')
  
  // Crear directorios necesarios para tests
  const testDirs = [
    'tests/temp',
    'tests/fixtures',
    'tests/mocks',
    'tests/coverage',
    'logs/test'
  ]
  
  testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`✅ Directorio creado: ${dir}`)
    }
  })
  
  // Configurar variables de entorno de test
  process.env.NODE_ENV = 'test'
  process.env.ALGORAND_NETWORK = 'testnet'
  process.env.LOG_LEVEL = 'error'
  
  // Crear archivos de configuración de test
  const testConfig = {
    network: 'testnet',
    timeout: 10000,
    retries: 3,
    parallel: true
  }
  
  fs.writeFileSync(
    'tests/test-config.json',
    JSON.stringify(testConfig, null, 2)
  )
  
  console.log('✅ Configuración global de testing completada')
}
