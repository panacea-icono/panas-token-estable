# 💡 Guía de Uso y Ejemplos - PanasToken Estable

## 📋 Descripción General

Esta guía proporciona ejemplos prácticos y casos de uso del PanasToken Estable para desarrolladores y usuarios finales.

## 🚀 Inicio Rápido

### 1. Instalación Básica

```bash
# Instalar dependencias
npm install panas-token-estable

# O clonar el repositorio
git clone https://github.com/panacea-icono/panas-token-estable.git
cd panas-token-estable
npm install
```

### 2. Configuración Inicial

```typescript
import { PanasToken } from 'panas-token-estable';

// Configuración del token
const tokenConfig = {
  name: 'PanasToken Estable',
  symbol: 'PANAS',
  decimals: 6,
  totalSupply: 1000000000,
  description: 'Token estable del ecosistema PANAS',
  url: 'https://github.com/panacea-icono/panas-token-estable',
  manager: 'YOUR_MANAGER_ADDRESS',
  reserve: 'YOUR_RESERVE_ADDRESS',
  freeze: 'YOUR_FREEZE_ADDRESS',
  clawback: 'YOUR_CLAWBACK_ADDRESS'
};

// Crear instancia del token
const panasToken = new PanasToken(tokenConfig);
```

## 🪙 Ejemplos de Operaciones del Token

### 1. Desplegar Token

```typescript
// Desplegar en testnet
async function deployToken() {
  try {
    const result = await panasToken.deploy('testnet');
    console.log('Token desplegado:', result);
    console.log('Asset ID:', result.assetId);
    console.log('Transaction ID:', result.transactionId);
  } catch (error) {
    console.error('Error al desplegar:', error);
  }
}

// Desplegar en mainnet
async function deployToMainnet() {
  try {
    const result = await panasToken.deploy('mainnet');
    console.log('Token desplegado en mainnet:', result);
  } catch (error) {
    console.error('Error al desplegar en mainnet:', error);
  }
}
```

### 2. Obtener Información del Token

```typescript
// Obtener información básica
function getTokenInfo() {
  const info = panasToken.getTokenInfo();
  console.log('Información del token:', info);
  
  // Salida:
  // {
  //   name: 'PanasToken Estable',
  //   symbol: 'PANAS',
  //   decimals: 6,
  //   totalSupply: 1000000000,
  //   formattedSupply: '1,000,000,000.000000'
  // }
}

// Obtener configuración
function getTokenConfig() {
  const config = panasToken.getConfig();
  console.log('Configuración:', config);
}
```

### 3. Operaciones de Transferencia

```typescript
// Transferir tokens
async function transferTokens() {
  try {
    const result = await panasToken.transfer(
      'FROM_ADDRESS',
      'TO_ADDRESS',
      1000000 // 1 PANAS (6 decimales)
    );
    
    console.log('Transferencia exitosa:', result);
    console.log('Transaction ID:', result.transactionId);
  } catch (error) {
    console.error('Error en transferencia:', error);
  }
}

// Transferir con validación
async function safeTransfer(from: string, to: string, amount: number) {
  // Validar direcciones
  if (!panasToken.isValidAddress(from)) {
    throw new Error('Dirección de origen inválida');
  }
  
  if (!panasToken.isValidAddress(to)) {
    throw new Error('Dirección de destino inválida');
  }
  
  // Validar monto
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  
  try {
    const result = await panasToken.transfer(from, to, amount);
    console.log('Transferencia segura exitosa:', result);
    return result;
  } catch (error) {
    console.error('Error en transferencia segura:', error);
    throw error;
  }
}
```

### 4. Operaciones de Mint y Burn

```typescript
// Crear nuevos tokens
async function mintTokens() {
  try {
    const result = await panasToken.mint(
      'RECIPIENT_ADDRESS',
      5000000 // 5 PANAS
    );
    
    console.log('Tokens creados:', result);
  } catch (error) {
    console.error('Error al crear tokens:', error);
  }
}

// Quemar tokens
async function burnTokens() {
  try {
    const result = await panasToken.burn(
      'OWNER_ADDRESS',
      1000000 // 1 PANAS
    );
    
    console.log('Tokens quemados:', result);
  } catch (error) {
    console.error('Error al quemar tokens:', error);
  }
}
```

## 🌐 Ejemplos de Integración con API

### 1. Cliente API Básico

```typescript
import { ApiClient } from 'panas-token-estable';

// Crear cliente API
const apiClient = new ApiClient('https://api.panas-token.com');

// Obtener información del token
async function getTokenInfo() {
  try {
    const response = await apiClient.get('/token/info');
    if (response.success) {
      console.log('Información del token:', response.data);
    } else {
      console.error('Error:', response.error);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
}

// Obtener balance
async function getBalance(address: string) {
  try {
    const response = await apiClient.get(`/token/balance/${address}`);
    if (response.success) {
      console.log('Balance:', response.data.balance);
      console.log('Balance formateado:', response.data.formatted_balance);
    }
  } catch (error) {
    console.error('Error al obtener balance:', error);
  }
}
```

### 2. Transferencia con API

```typescript
// Transferir usando API
async function transferWithAPI() {
  try {
    const response = await apiClient.post('/token/transfer', {
      from: 'FROM_ADDRESS',
      to: 'TO_ADDRESS',
      amount: '100000000000',
      note: 'Transferencia de prueba'
    });
    
    if (response.success) {
      console.log('Transferencia exitosa:', response.data);
    } else {
      console.error('Error en transferencia:', response.error);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
}
```

### 3. Historial de Transacciones

```typescript
// Obtener historial de transacciones
async function getTransactionHistory() {
  try {
    const response = await apiClient.get('/transactions?page=1&limit=10');
    
    if (response.success) {
      const transactions = response.data.transactions;
      console.log('Transacciones:', transactions);
      
      // Procesar cada transacción
      transactions.forEach(tx => {
        console.log(`TX: ${tx.id} - ${tx.type} - ${tx.amount} PANAS`);
      });
    }
  } catch (error) {
    console.error('Error al obtener historial:', error);
  }
}
```

## 🎨 Ejemplos de Frontend (React)

### 1. Componente de Balance

```tsx
import React, { useState, useEffect } from 'react';
import { PanasToken } from 'panas-token-estable';

interface BalanceProps {
  address: string;
  token: PanasToken;
}

export const BalanceComponent: React.FC<BalanceProps> = ({ address, token }) => {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        // Simular obtención de balance
        const mockBalance = '100000000000'; // 100 PANAS
        setBalance(token.calculateSupply(parseInt(mockBalance)));
      } catch (error) {
        console.error('Error al obtener balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, token]);

  if (loading) {
    return <div>Cargando balance...</div>;
  }

  return (
    <div className="balance-component">
      <h3>Balance de PANAS</h3>
      <p className="balance-amount">{balance} PANAS</p>
      <p className="balance-address">Dirección: {token.formatAddress(address)}</p>
    </div>
  );
};
```

### 2. Componente de Transferencia

```tsx
import React, { useState } from 'react';
import { PanasToken } from 'panas-token-estable';

interface TransferProps {
  token: PanasToken;
  fromAddress: string;
}

export const TransferComponent: React.FC<TransferProps> = ({ token, fromAddress }) => {
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleTransfer = async () => {
    if (!toAddress || !amount) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    if (!token.isValidAddress(toAddress)) {
      setMessage('Dirección de destino inválida');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const result = await token.transfer(
        fromAddress,
        toAddress,
        parseFloat(amount) * 1000000 // Convertir a micro-units
      );

      setMessage(`Transferencia exitosa! TX: ${result.transactionId}`);
      setToAddress('');
      setAmount('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-component">
      <h3>Transferir PANAS</h3>
      
      <div className="form-group">
        <label>Dirección de destino:</label>
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="ALGORAND_ADDRESS"
        />
      </div>

      <div className="form-group">
        <label>Cantidad (PANAS):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1.0"
          step="0.000001"
        />
      </div>

      <button 
        onClick={handleTransfer} 
        disabled={loading}
        className="transfer-button"
      >
        {loading ? 'Transfiriendo...' : 'Transferir'}
      </button>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};
```

### 3. Hook Personalizado para Token

```tsx
import { useState, useEffect } from 'react';
import { PanasToken } from 'panas-token-estable';

export const usePanasToken = (config: any) => {
  const [token, setToken] = useState<PanasToken | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const tokenInstance = new PanasToken(config);
      setToken(tokenInstance);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [config]);

  const transfer = async (from: string, to: string, amount: number) => {
    if (!token) throw new Error('Token no inicializado');
    return await token.transfer(from, to, amount);
  };

  const getBalance = async (address: string) => {
    if (!token) throw new Error('Token no inicializado');
    // Implementar lógica de obtención de balance
    return '0';
  };

  return {
    token,
    loading,
    error,
    transfer,
    getBalance
  };
};
```

## 🔧 Ejemplos de Utilidades

### 1. Formateo de Números

```typescript
// Formatear cantidad de tokens
function formatTokenAmount(amount: number, decimals: number = 6): string {
  return (amount / Math.pow(10, decimals)).toFixed(decimals);
}

// Ejemplo de uso
const amount = 1000000; // 1 PANAS en micro-units
const formatted = formatTokenAmount(amount, 6);
console.log(formatted); // "1.000000"
```

### 2. Validación de Direcciones

```typescript
// Validar dirección de Algorand
function isValidAlgorandAddress(address: string): boolean {
  const regex = /^[A-Z2-7]{58}$/;
  return regex.test(address);
}

// Ejemplo de uso
const address = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567890';
if (isValidAlgorandAddress(address)) {
  console.log('Dirección válida');
} else {
  console.log('Dirección inválida');
}
```

### 3. Conversión de Unidades

```typescript
// Convertir entre unidades
class TokenUnits {
  static toMicroUnits(amount: number, decimals: number = 6): number {
    return Math.floor(amount * Math.pow(10, decimals));
  }

  static fromMicroUnits(amount: number, decimals: number = 6): number {
    return amount / Math.pow(10, decimals);
  }

  static format(amount: number, decimals: number = 6): string {
    return this.fromMicroUnits(amount, decimals).toFixed(decimals);
  }
}

// Ejemplos de uso
const microUnits = TokenUnits.toMicroUnits(1.5); // 1500000
const formatted = TokenUnits.format(microUnits); // "1.500000"
const backToUnits = TokenUnits.fromMicroUnits(microUnits); // 1.5
```

## 📊 Ejemplos de Monitoreo

### 1. Logger Personalizado

```typescript
import { logger } from 'panas-token-estable';

// Logging de operaciones
async function logTransfer(from: string, to: string, amount: number) {
  logger.info('Iniciando transferencia', {
    from: from,
    to: to,
    amount: amount,
    timestamp: new Date().toISOString()
  });

  try {
    const result = await panasToken.transfer(from, to, amount);
    
    logger.info('Transferencia exitosa', {
      transactionId: result.transactionId,
      amount: amount
    });
    
    return result;
  } catch (error) {
    logger.error('Error en transferencia', {
      error: error.message,
      from: from,
      to: to,
      amount: amount
    });
    
    throw error;
  }
}
```

### 2. Métricas de Performance

```typescript
// Medir tiempo de operaciones
async function measureOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    logger.info('Operación completada', {
      operation: operationName,
      duration: `${duration.toFixed(2)}ms`,
      success: true
    });
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    logger.error('Operación falló', {
      operation: operationName,
      duration: `${duration.toFixed(2)}ms`,
      error: error.message,
      success: false
    });
    
    throw error;
  }
}

// Ejemplo de uso
const result = await measureOperation(
  () => panasToken.transfer(from, to, amount),
  'transfer'
);
```

## 🧪 Ejemplos de Testing

### 1. Test Unitario

```typescript
import { PanasToken } from 'panas-token-estable';

describe('PanasToken', () => {
  let token: PanasToken;

  beforeEach(() => {
    const config = {
      name: 'Test Token',
      symbol: 'TEST',
      decimals: 6,
      totalSupply: 1000000,
      manager: 'TEST_MANAGER',
      reserve: 'TEST_RESERVE',
      freeze: 'TEST_FREEZE',
      clawback: 'TEST_CLAWBACK'
    };
    
    token = new PanasToken(config);
  });

  it('should create token with valid config', () => {
    expect(token).toBeDefined();
    expect(token.getConfig().name).toBe('Test Token');
  });

  it('should validate addresses correctly', () => {
    expect(token.isValidAddress('VALID_ADDRESS')).toBe(true);
    expect(token.isValidAddress('INVALID')).toBe(false);
  });
});
```

### 2. Test de Integración

```typescript
describe('Token Operations Integration', () => {
  it('should complete transfer flow', async () => {
    // Mock de la operación
    const mockTransfer = jest.fn().mockResolvedValue({
      transactionId: 'tx_123',
      amount: 1000000
    });

    token.transfer = mockTransfer;

    const result = await token.transfer('FROM', 'TO', 1000000);
    
    expect(result.transactionId).toBe('tx_123');
    expect(mockTransfer).toHaveBeenCalledWith('FROM', 'TO', 1000000);
  });
});
```

## 🚀 Ejemplos de Despliegue

### 1. Script de Despliegue

```typescript
// scripts/deploy.ts
import { PanasToken } from '../src/contracts';
import { logger } from '../src/utils/logger';

async function deployToNetwork(network: 'testnet' | 'mainnet') {
  try {
    logger.info(`Iniciando despliegue en ${network}`);
    
    const config = {
      // Configuración específica por red
      manager: process.env[`${network.toUpperCase()}_MANAGER_ADDRESS`],
      reserve: process.env[`${network.toUpperCase()}_RESERVE_ADDRESS`],
      // ... otras configuraciones
    };
    
    const token = new PanasToken(config);
    const result = await token.deploy(network);
    
    logger.info('Despliegue exitoso', {
      network: network,
      assetId: result.assetId,
      transactionId: result.transactionId
    });
    
    return result;
  } catch (error) {
    logger.error('Error en despliegue', {
      network: network,
      error: error.message
    });
    throw error;
  }
}

// Ejecutar despliegue
if (require.main === module) {
  const network = process.argv[2] as 'testnet' | 'mainnet';
  deployToNetwork(network)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
```

### 2. Health Check

```typescript
// scripts/health-check.ts
import { ApiClient } from '../src/api';

async function healthCheck() {
  const apiClient = new ApiClient(process.env.API_URL || 'http://localhost:8080');
  
  try {
    const response = await apiClient.get('/health');
    
    if (response.success) {
      console.log('✅ Sistema saludable');
      return true;
    } else {
      console.log('❌ Sistema no saludable');
      return false;
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    return false;
  }
}

// Ejecutar health check
healthCheck().then(success => {
  process.exit(success ? 0 : 1);
});
```

## 🆘 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a Algorand**
   ```typescript
   // Verificar configuración de red
   const networkConfig = token.getNetworkConfig('testnet');
   console.log('Configuración de red:', networkConfig);
   ```

2. **Error de balance insuficiente**
   ```typescript
   // Verificar balance antes de transferir
   const balance = await getBalance(address);
   if (balance < amount) {
     throw new Error('Balance insuficiente');
   }
   ```

3. **Error de validación de dirección**
   ```typescript
   // Validar dirección antes de usar
   if (!token.isValidAddress(address)) {
     throw new Error('Dirección inválida');
   }
   ```

## 📚 Recursos Adicionales

- **Documentación completa**: [docs.panas-token.com](https://docs.panas-token.com)
- **API Reference**: [api.panas-token.com/docs](https://api.panas-token.com/docs)
- **GitHub Repository**: [github.com/panacea-icono/panas-token-estable](https://github.com/panacea-icono/panas-token-estable)
- **Comunidad**: [discord.gg/panas-token](https://discord.gg/panas-token)

¡Feliz desarrollo! 🚀
