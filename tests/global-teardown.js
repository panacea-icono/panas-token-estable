// Global teardown para Jest
// Se ejecuta una vez después de todos los tests

const fs = require('fs')
const path = require('path')

module.exports = async () => {
  console.log('🧹 Limpiando entorno de testing...')
  
  // Limpiar archivos temporales
  const tempDirs = [
    'tests/temp',
    'tests/coverage',
    'logs/test'
  ]
  
  tempDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
      console.log(`✅ Directorio limpiado: ${dir}`)
    }
  })
  
  // Limpiar archivos de configuración de test
  const testFiles = [
    'tests/test-config.json',
    'tests/temp-*.json',
    'tests/mock-*.json'
  ]
  
  testFiles.forEach(pattern => {
    const files = fs.readdirSync('tests').filter(file => 
      file.match(pattern.replace('*', '.*'))
    )
    
    files.forEach(file => {
      fs.unlinkSync(path.join('tests', file))
      console.log(`✅ Archivo limpiado: ${file}`)
    })
  })
  
  console.log('✅ Limpieza de testing completada')
}
