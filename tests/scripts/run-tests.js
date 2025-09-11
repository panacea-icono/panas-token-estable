#!/usr/bin/env node

/**
 * Script para ejecutar todos los tests del proyecto PanasToken Estable
 * Soporta diferentes tipos de tests: unit, integration, e2e, performance, security
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

// Configuración
const config = {
  testTypes: ['unit', 'integration', 'e2e', 'performance', 'security'],
  coverage: true,
  verbose: false,
  watch: false,
  parallel: true,
  timeout: 30000
}

// Función para imprimir con colores
function print(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Función para ejecutar comando
function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
      ...options
    })
    return { success: true, result }
  } catch (error) {
    return { success: false, error }
  }
}

// Función para verificar dependencias
function checkDependencies() {
  print('blue', '🔍 Verificando dependencias...')
  
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    print('red', '❌ No se encontró package.json')
    process.exit(1)
  }
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules')
  if (!fs.existsSync(nodeModulesPath)) {
    print('yellow', '⚠️  node_modules no encontrado. Ejecutando npm install...')
    const installResult = runCommand('npm install')
    if (!installResult.success) {
      print('red', '❌ Error al instalar dependencias')
      process.exit(1)
    }
  }
  
  print('green', '✅ Dependencias verificadas')
}

// Función para ejecutar tests unitarios
function runUnitTests() {
  print('blue', '🧪 Ejecutando tests unitarios...')
  
  const command = `npm test -- --testPathPattern="tests/unit" --coverage=${config.coverage} --verbose=${config.verbose}`
  const result = runCommand(command)
  
  if (result.success) {
    print('green', '✅ Tests unitarios completados')
  } else {
    print('red', '❌ Tests unitarios fallaron')
    return false
  }
  
  return true
}

// Función para ejecutar tests de integración
function runIntegrationTests() {
  print('blue', '🔗 Ejecutando tests de integración...')
  
  const command = `npm test -- --testPathPattern="tests/integration" --coverage=${config.coverage} --verbose=${config.verbose}`
  const result = runCommand(command)
  
  if (result.success) {
    print('green', '✅ Tests de integración completados')
  } else {
    print('red', '❌ Tests de integración fallaron')
    return false
  }
  
  return true
}

// Función para ejecutar tests E2E
function runE2ETests() {
  print('blue', '🌐 Ejecutando tests end-to-end...')
  
  const command = `npm test -- --testPathPattern="tests/e2e" --coverage=${config.coverage} --verbose=${config.verbose}`
  const result = runCommand(command)
  
  if (result.success) {
    print('green', '✅ Tests E2E completados')
  } else {
    print('red', '❌ Tests E2E fallaron')
    return false
  }
  
  return true
}

// Función para ejecutar tests de performance
function runPerformanceTests() {
  print('blue', '⚡ Ejecutando tests de performance...')
  
  const command = `npm test -- --testPathPattern="tests/performance" --coverage=${config.coverage} --verbose=${config.verbose}`
  const result = runCommand(command)
  
  if (result.success) {
    print('green', '✅ Tests de performance completados')
  } else {
    print('red', '❌ Tests de performance fallaron')
    return false
  }
  
  return true
}

// Función para ejecutar tests de seguridad
function runSecurityTests() {
  print('blue', '🔒 Ejecutando tests de seguridad...')
  
  const command = `npm test -- --testPathPattern="tests/security" --coverage=${config.coverage} --verbose=${config.verbose}`
  const result = runCommand(command)
  
  if (result.success) {
    print('green', '✅ Tests de seguridad completados')
  } else {
    print('red', '❌ Tests de seguridad fallaron')
    return false
  }
  
  return true
}

// Función para ejecutar todos los tests
function runAllTests() {
  print('blue', '🚀 Ejecutando todos los tests...')
  
  const command = `npm test -- --coverage=${config.coverage} --verbose=${config.verbose}`
  const result = runCommand(command)
  
  if (result.success) {
    print('green', '✅ Todos los tests completados')
  } else {
    print('red', '❌ Algunos tests fallaron')
    return false
  }
  
  return true
}

// Función para generar reporte de coverage
function generateCoverageReport() {
  if (!config.coverage) return
  
  print('blue', '📊 Generando reporte de coverage...')
  
  const command = 'npm run test:coverage'
  const result = runCommand(command)
  
  if (result.success) {
    print('green', '✅ Reporte de coverage generado')
    print('cyan', '📁 Reporte disponible en: coverage/lcov-report/index.html')
  } else {
    print('yellow', '⚠️  No se pudo generar el reporte de coverage')
  }
}

// Función para limpiar archivos temporales
function cleanup() {
  print('blue', '🧹 Limpiando archivos temporales...')
  
  const tempDirs = ['coverage', 'logs/test', 'tests/temp']
  
  tempDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true, force: true })
        print('green', `✅ Directorio limpiado: ${dir}`)
      } catch (error) {
        print('yellow', `⚠️  No se pudo limpiar: ${dir}`)
      }
    }
  })
}

// Función principal
function main() {
  const args = process.argv.slice(2)
  const testType = args[0] || 'all'
  
  print('cyan', '🧪 PanasToken Estable - Test Runner')
  print('cyan', '=====================================')
  
  // Verificar dependencias
  checkDependencies()
  
  // Limpiar archivos temporales
  cleanup()
  
  let success = true
  
  // Ejecutar tests según el tipo
  switch (testType) {
    case 'unit':
      success = runUnitTests()
      break
    case 'integration':
      success = runIntegrationTests()
      break
    case 'e2e':
      success = runE2ETests()
      break
    case 'performance':
      success = runPerformanceTests()
      break
    case 'security':
      success = runSecurityTests()
      break
    case 'all':
    default:
      success = runAllTests()
      break
  }
  
  // Generar reporte de coverage
  if (success && config.coverage) {
    generateCoverageReport()
  }
  
  // Mostrar resumen
  print('cyan', '=====================================')
  if (success) {
    print('green', '🎉 Todos los tests completados exitosamente!')
  } else {
    print('red', '💥 Algunos tests fallaron. Revisa el output anterior.')
    process.exit(1)
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main()
}

module.exports = {
  runUnitTests,
  runIntegrationTests,
  runE2ETests,
  runPerformanceTests,
  runSecurityTests,
  runAllTests,
  generateCoverageReport,
  cleanup
}
