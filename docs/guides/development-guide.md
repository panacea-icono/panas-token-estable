# 👨‍💻 Guía de Desarrollo - PanasToken Estable

## 📋 Descripción General

Esta guía proporciona información detallada para desarrolladores que quieren contribuir al proyecto PanasToken Estable.

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
panas-token-estable/
├── src/                     # Código fuente principal
│   ├── contracts/          # Contratos inteligentes
│   ├── api/                # Capa de API
│   ├── utils/              # Utilidades
│   ├── types/              # Definiciones de tipos
│   └── index.ts            # Punto de entrada
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── hooks/          # Hooks personalizados
│   │   └── utils/          # Utilidades del frontend
│   └── public/             # Archivos estáticos
├── contracts/              # Contratos PyTeal
├── scripts/                # Scripts de automatización
├── tests/                  # Suite de tests
├── docs/                   # Documentación
└── config/                 # Configuraciones
```

### Tecnologías Utilizadas

- **Backend**: Node.js, TypeScript, Express
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Blockchain**: Algorand, PyTeal, algosdk
- **Testing**: Jest, Supertest
- **CI/CD**: GitHub Actions
- **Containerización**: Docker

## 🚀 Configuración del Entorno de Desarrollo

### 1. Prerrequisitos

```bash
# Verificar versiones
node --version  # v18.0.0+
npm --version   # v8.0.0+
git --version   # v2.30.0+
```

### 2. Configuración Inicial

```bash
# Clonar repositorio
git clone https://github.com/panacea-icono/panas-token-estable.git
cd panas-token-estable

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### 3. Configuración de IDE

#### VS Code (Recomendado)

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.workingDirectories": ["./", "./frontend"]
}
```

#### Extensiones Recomendadas

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**
- **Tailwind CSS IntelliSense**

## 🔧 Flujo de Desarrollo

### 1. Crear una Rama

```bash
# Crear y cambiar a nueva rama
git checkout -b feature/nueva-funcionalidad

# O para corrección de bugs
git checkout -b fix/corregir-bug
```

### 2. Desarrollo Local

```bash
# Ejecutar en modo desarrollo
npm run dev

# En otra terminal, ejecutar frontend
cd frontend && npm run dev

# Ejecutar tests en modo watch
npm run test:watch
```

### 3. Testing

```bash
# Ejecutar todos los tests
npm test

# Tests específicos
npm run test:unit
npm run test:integration
npm run test:e2e

# Con coverage
npm run test:coverage
```

### 4. Linting y Formateo

```bash
# Verificar linting
npm run lint

# Corregir automáticamente
npm run lint:fix

# Formatear código
npm run format
```

### 5. Commit y Push

```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad de transferencia"

# Push a la rama
git push origin feature/nueva-funcionalidad
```

## 📝 Estándares de Código

### Convenciones de Naming

```typescript
// Variables y funciones: camelCase
const tokenBalance = 1000000;
function calculateSupply() { }

// Clases: PascalCase
class PanasToken { }

// Constantes: UPPER_SNAKE_CASE
const MAX_SUPPLY = 1000000000;

// Interfaces: PascalCase con prefijo I
interface ITokenConfig { }

// Enums: PascalCase
enum TokenStatus { }
```

### Estructura de Archivos

```typescript
// 1. Imports externos
import React from 'react';
import { useState } from 'react';

// 2. Imports internos
import { PanasToken } from '../contracts';
import { TokenConfig } from '../types';

// 3. Imports de tipos
import type { ApiResponse } from './types';

// 4. Definiciones de tipos
interface ComponentProps {
  token: PanasToken;
}

// 5. Componente principal
export const TokenComponent: React.FC<ComponentProps> = ({ token }) => {
  // 6. Hooks
  const [balance, setBalance] = useState(0);
  
  // 7. Funciones auxiliares
  const handleTransfer = () => { };
  
  // 8. Render
  return <div>{balance}</div>;
};
```

### Documentación de Código

```typescript
/**
 * Clase principal para manejar operaciones del PanasToken
 * 
 * @example
 * ```typescript
 * const token = new PanasToken(config);
 * await token.deploy('testnet');
 * ```
 */
export class PanasToken {
  /**
   * Despliega el token en la red especificada
   * 
   * @param network - Red de Algorand (testnet/mainnet)
   * @returns Promise con datos del despliegue
   * @throws {Error} Si el despliegue falla
   */
  async deploy(network: 'testnet' | 'mainnet'): Promise<DeploymentResult> {
    // Implementación
  }
}
```

## 🧪 Testing

### Estructura de Tests

```typescript
describe('PanasToken', () => {
  let token: PanasToken;
  let mockConfig: TokenConfig;

  beforeEach(() => {
    // Setup
  });

  describe('Constructor', () => {
    it('should create instance with valid config', () => {
      // Test
    });
  });

  describe('deploy', () => {
    it('should deploy successfully', async () => {
      // Test
    });
  });
});
```

### Mejores Prácticas de Testing

1. **Un test por comportamiento**
2. **Nombres descriptivos**
3. **Setup y teardown apropiados**
4. **Mocks para dependencias externas**
5. **Cobertura del 80% mínimo**

## 🔄 Git Workflow

### 1. Rama Principal

- **main**: Código de producción
- **develop**: Código de desarrollo

### 2. Tipos de Ramas

- **feature/**: Nuevas funcionalidades
- **fix/**: Corrección de bugs
- **hotfix/**: Correcciones urgentes
- **docs/**: Documentación

### 3. Commit Messages

```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

### 4. Pull Request

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Testing
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests E2E

## Checklist
- [ ] Código formateado
- [ ] Tests pasando
- [ ] Documentación actualizada
- [ ] Sin conflictos
```

## 🐛 Debugging

### 1. Logs de Desarrollo

```typescript
// Usar logger configurado
import { logger } from '../utils/logger';

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### 2. Debugging en VS Code

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 3. Herramientas de Debugging

```bash
# Debug de tests
npm run test:debug

# Debug de aplicación
node --inspect src/index.js

# Debug de frontend
cd frontend && npm run dev -- --debug
```

## 📦 Construcción y Despliegue

### 1. Construcción Local

```bash
# Construir todo
npm run build

# Construir solo contratos
npm run build:contracts

# Construir solo frontend
cd frontend && npm run build
```

### 2. Despliegue

```bash
# Testnet
npm run deploy:testnet

# Mainnet
npm run deploy:mainnet

# Verificar despliegue
npm run health-check
```

## 🔍 Code Review

### Checklist para Reviewers

- [ ] **Funcionalidad**: ¿El código hace lo que se supone?
- [ ] **Testing**: ¿Hay tests adecuados?
- [ ] **Performance**: ¿Es eficiente?
- [ ] **Seguridad**: ¿Hay vulnerabilidades?
- [ ] **Documentación**: ¿Está documentado?
- [ ] **Estándares**: ¿Sigue las convenciones?

### Checklist para Desarrolladores

- [ ] **Tests**: ¿Todos los tests pasan?
- [ ] **Linting**: ¿Sin errores de linting?
- [ ] **Documentación**: ¿Actualizada?
- [ ] **Commits**: ¿Mensajes descriptivos?
- [ ] **Rama**: ¿Actualizada con main/develop?

## 🆘 Obtener Ayuda

### Recursos Internos

- **Documentación**: [docs/](.)
- **Código**: [src/](../src/)
- **Tests**: [tests/](../tests/)
- **Issues**: [GitHub Issues](https://github.com/panacea-icono/panas-token-estable/issues)

### Recursos Externos

- **Algorand Docs**: [developer.algorand.org](https://developer.algorand.org)
- **React Docs**: [react.dev](https://react.dev)
- **TypeScript Docs**: [typescriptlang.org](https://typescriptlang.org)

### Contacto

- **Email**: dev@panacea-icono.com
- **Slack**: #panas-token-dev
- **GitHub**: [@panacea-icono](https://github.com/panacea-icono)

¡Feliz desarrollo! 🚀
