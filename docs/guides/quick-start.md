# 🚀 Guía de Inicio Rápido - PanasToken Estable

## 📋 Descripción General

Esta guía te ayudará a configurar y ejecutar el proyecto PanasToken Estable en menos de 10 minutos.

## ⚡ Instalación Rápida

### Prerrequisitos

- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior
- **Git**: Para clonar el repositorio
- **Algorand Wallet**: Para transacciones (opcional)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/panacea-icono/panas-token-estable.git
cd panas-token-estable
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias principales
npm install

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables de entorno
nano .env
```

**Variables mínimas requeridas:**
```env
NODE_ENV=development
ALGORAND_NETWORK=testnet
TESTNET_MANAGER_ADDRESS=tu_direccion_manager
TESTNET_RESERVE_ADDRESS=tu_direccion_reserve
```

### 4. Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run dev

# En otra terminal, ejecutar frontend
cd frontend
npm run dev
```

## 🎯 Primeros Pasos

### 1. Verificar Instalación

```bash
# Ejecutar tests
npm test

# Verificar linting
npm run lint

# Verificar build
npm run build
```

### 2. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080
- **Documentación**: http://localhost:3000/docs

### 3. Conectar Wallet

1. Abre la aplicación en el navegador
2. Haz clic en "Conectar Wallet"
3. Selecciona tu wallet de Algorand
4. Autoriza la conexión

## 🔧 Comandos Útiles

### Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev

# Ejecutar frontend
cd frontend && npm run dev

# Ejecutar tests
npm test

# Ejecutar tests específicos
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Construcción

```bash
# Construir para producción
npm run build

# Construir frontend
cd frontend && npm run build

# Construir contratos
npm run build:contracts
```

### Despliegue

```bash
# Desplegar en testnet
npm run deploy:testnet

# Desplegar en mainnet
npm run deploy:mainnet

# Verificar salud del sistema
npm run health-check
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"

```bash
# Limpiar cache y reinstalar
npm run test:clean
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"

```bash
# Cambiar puerto en .env
PORT=3001
```

### Error: "Algorand network connection failed"

```bash
# Verificar configuración de red
npm run setup
```

## 📚 Próximos Pasos

1. **Leer la [Guía de Desarrollo](development-guide.md)**
2. **Explorar la [API Reference](api-reference.md)**
3. **Revisar los [Ejemplos de Uso](usage-examples.md)**
4. **Configurar [Despliegue en Producción](deployment-guide.md)**

## 🆘 Obtener Ayuda

- **Documentación**: [docs/](.)
- **Issues**: [GitHub Issues](https://github.com/panacea-icono/panas-token-estable/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/panacea-icono/panas-token-estable/discussions)
- **Email**: support@panacea-icono.com

## ✅ Verificación de Instalación

Ejecuta este comando para verificar que todo está funcionando:

```bash
npm run health-check
```

**Salida esperada:**
```
✅ Node.js version: v18.x.x
✅ npm version: v8.x.x
✅ Dependencies installed
✅ Environment configured
✅ Algorand network: testnet
✅ All systems ready!
```

¡Felicidades! 🎉 Has configurado exitosamente el PanasToken Estable.
