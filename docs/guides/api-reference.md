# 📚 Referencia de API - PanasToken Estable

## 📋 Descripción General

Esta documentación proporciona una referencia completa de la API del PanasToken Estable, incluyendo endpoints, parámetros, respuestas y ejemplos de uso.

## 🔗 Base URL

```
Desarrollo: http://localhost:8080/api
Testnet: https://api-testnet.panas-token.com/api
Mainnet: https://api.panas-token.com/api
```

## 🔐 Autenticación

### Headers Requeridos

```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Key: <api-key>
```

### Obtener Token

```http
POST /auth/login
Content-Type: application/json

{
  "wallet_address": "ALGORAND_ADDRESS",
  "signature": "SIGNATURE"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "expires_in": 3600,
    "user": {
      "address": "ALGORAND_ADDRESS",
      "role": "user"
    }
  }
}
```

## 🪙 Endpoints del Token

### 1. Información del Token

#### GET /token/info

Obtiene información general del token.

**Parámetros:** Ninguno

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "asset_id": 123456789,
    "name": "PanasToken Estable",
    "symbol": "PANAS",
    "decimals": 6,
    "total_supply": "1000000000000000",
    "circulating_supply": "500000000000000",
    "manager": "MANAGER_ADDRESS",
    "reserve": "RESERVE_ADDRESS",
    "freeze": "FREEZE_ADDRESS",
    "clawback": "CLAWBACK_ADDRESS",
    "url": "https://github.com/panacea-icono/panas-token-estable",
    "description": "Token estable del ecosistema PANAS"
  }
}
```

### 2. Balance del Usuario

#### GET /token/balance/{address}

Obtiene el balance del token para una dirección específica.

**Parámetros:**
- `address` (string): Dirección de Algorand

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "address": "ALGORAND_ADDRESS",
    "balance": "100000000000",
    "formatted_balance": "100,000.000000",
    "asset_id": 123456789
  }
}
```

### 3. Transferir Tokens

#### POST /token/transfer

Transfiere tokens entre direcciones.

**Body:**
```json
{
  "from": "ALGORAND_ADDRESS",
  "to": "ALGORAND_ADDRESS",
  "amount": "100000000000",
  "note": "Transfer description (optional)"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "tx_123456789",
    "from": "ALGORAND_ADDRESS",
    "to": "ALGORAND_ADDRESS",
    "amount": "100000000000",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 4. Mint Tokens

#### POST /token/mint

Crea nuevos tokens (solo manager).

**Body:**
```json
{
  "to": "ALGORAND_ADDRESS",
  "amount": "100000000000"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "tx_mint_123456789",
    "to": "ALGORAND_ADDRESS",
    "amount": "100000000000",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 5. Burn Tokens

#### POST /token/burn

Quema tokens (solo manager).

**Body:**
```json
{
  "from": "ALGORAND_ADDRESS",
  "amount": "100000000000"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "tx_burn_123456789",
    "from": "ALGORAND_ADDRESS",
    "amount": "100000000000",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## 📊 Endpoints de Transacciones

### 1. Historial de Transacciones

#### GET /transactions

Obtiene el historial de transacciones del usuario.

**Query Parameters:**
- `page` (number): Número de página (default: 1)
- `limit` (number): Elementos por página (default: 20)
- `type` (string): Tipo de transacción (transfer, mint, burn)
- `status` (string): Estado de la transacción (pending, confirmed, failed)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx_123456789",
        "type": "transfer",
        "from": "ALGORAND_ADDRESS",
        "to": "ALGORAND_ADDRESS",
        "amount": "100000000000",
        "status": "confirmed",
        "created_at": "2024-01-01T00:00:00Z",
        "confirmed_at": "2024-01-01T00:01:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### 2. Detalles de Transacción

#### GET /transactions/{id}

Obtiene detalles de una transacción específica.

**Parámetros:**
- `id` (string): ID de la transacción

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "tx_123456789",
    "type": "transfer",
    "from": "ALGORAND_ADDRESS",
    "to": "ALGORAND_ADDRESS",
    "amount": "100000000000",
    "status": "confirmed",
    "block_height": 12345678,
    "created_at": "2024-01-01T00:00:00Z",
    "confirmed_at": "2024-01-01T00:01:00Z",
    "explorer_url": "https://testnet.algoexplorer.io/tx/tx_123456789"
  }
}
```

## 📈 Endpoints de Estadísticas

### 1. Estadísticas Generales

#### GET /stats/overview

Obtiene estadísticas generales del token.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total_supply": "1000000000000000",
    "circulating_supply": "500000000000000",
    "total_holders": 1234,
    "total_transactions": 5678,
    "market_cap": "500000.00",
    "price_usd": "1.00",
    "last_updated": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Estadísticas de Red

#### GET /stats/network

Obtiene estadísticas de la red Algorand.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "network": "testnet",
    "block_height": 12345678,
    "avg_block_time": 4.2,
    "total_transactions": 987654321,
    "active_addresses": 12345,
    "last_updated": "2024-01-01T00:00:00Z"
  }
}
```

## 🔍 Endpoints de Búsqueda

### 1. Buscar Direcciones

#### GET /search/addresses

Busca direcciones por criterios específicos.

**Query Parameters:**
- `q` (string): Término de búsqueda
- `type` (string): Tipo de dirección (user, manager, reserve)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "address": "ALGORAND_ADDRESS",
        "type": "user",
        "balance": "100000000000",
        "first_seen": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 1
  }
}
```

### 2. Buscar Transacciones

#### GET /search/transactions

Busca transacciones por criterios específicos.

**Query Parameters:**
- `q` (string): Término de búsqueda
- `from` (string): Dirección de origen
- `to` (string): Dirección de destino
- `amount_min` (number): Monto mínimo
- `amount_max` (number): Monto máximo

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx_123456789",
        "type": "transfer",
        "from": "ALGORAND_ADDRESS",
        "to": "ALGORAND_ADDRESS",
        "amount": "100000000000",
        "status": "confirmed",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 1
  }
}
```

## ⚠️ Códigos de Error

### Códigos HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Solicitud inválida |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Límite de velocidad |
| 500 | Internal Server Error - Error del servidor |

### Códigos de Error Personalizados

| Código | Descripción |
|--------|-------------|
| TOKEN_NOT_FOUND | Token no encontrado |
| INSUFFICIENT_BALANCE | Balance insuficiente |
| INVALID_ADDRESS | Dirección inválida |
| INVALID_AMOUNT | Monto inválido |
| TRANSACTION_FAILED | Transacción falló |
| NETWORK_ERROR | Error de red |
| RATE_LIMIT_EXCEEDED | Límite de velocidad excedido |

### Ejemplo de Error

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Balance insuficiente para realizar la transacción",
    "details": {
      "required": "100000000000",
      "available": "50000000000"
    }
  }
}
```

## 📝 Ejemplos de Uso

### JavaScript/TypeScript

```typescript
// Configuración
const API_BASE = 'https://api.panas-token.com/api';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
};

// Obtener información del token
async function getTokenInfo() {
  const response = await fetch(`${API_BASE}/token/info`, { headers });
  return await response.json();
}

// Transferir tokens
async function transferTokens(from: string, to: string, amount: string) {
  const response = await fetch(`${API_BASE}/token/transfer`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ from, to, amount })
  });
  return await response.json();
}

// Obtener balance
async function getBalance(address: string) {
  const response = await fetch(`${API_BASE}/token/balance/${address}`, { headers });
  return await response.json();
}
```

### Python

```python
import requests

# Configuración
API_BASE = 'https://api.panas-token.com/api'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'
}

# Obtener información del token
def get_token_info():
    response = requests.get(f'{API_BASE}/token/info', headers=headers)
    return response.json()

# Transferir tokens
def transfer_tokens(from_addr, to_addr, amount):
    data = {
        'from': from_addr,
        'to': to_addr,
        'amount': amount
    }
    response = requests.post(f'{API_BASE}/token/transfer', 
                           headers=headers, json=data)
    return response.json()
```

### cURL

```bash
# Obtener información del token
curl -X GET "https://api.panas-token.com/api/token/info" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Transferir tokens
curl -X POST "https://api.panas-token.com/api/token/transfer" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "from": "ALGORAND_ADDRESS",
    "to": "ALGORAND_ADDRESS",
    "amount": "100000000000"
  }'
```

## 🔄 Rate Limiting

### Límites por Endpoint

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `/token/info` | 1000/min | 1 minuto |
| `/token/balance/*` | 500/min | 1 minuto |
| `/token/transfer` | 100/min | 1 minuto |
| `/transactions` | 200/min | 1 minuto |
| `/stats/*` | 300/min | 1 minuto |

### Headers de Rate Limiting

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📊 Webhooks

### Configuración

```http
POST /webhooks/register
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["transaction.confirmed", "transaction.failed"],
  "secret": "webhook_secret"
}
```

### Eventos Disponibles

- `transaction.confirmed` - Transacción confirmada
- `transaction.failed` - Transacción falló
- `balance.updated` - Balance actualizado
- `token.minted` - Tokens creados
- `token.burned` - Tokens quemados

### Payload del Webhook

```json
{
  "event": "transaction.confirmed",
  "data": {
    "transaction_id": "tx_123456789",
    "type": "transfer",
    "from": "ALGORAND_ADDRESS",
    "to": "ALGORAND_ADDRESS",
    "amount": "100000000000",
    "confirmed_at": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🆘 Soporte

Para soporte técnico o preguntas sobre la API:

- **Email**: api-support@panacea-icono.com
- **Documentación**: [docs.panas-token.com](https://docs.panas-token.com)
- **GitHub**: [github.com/panacea-icono/panas-token-estable](https://github.com/panacea-icono/panas-token-estable)
