# PANAS Token Estable - Monorepo

**Token índice estable multi-activo** respaldado por VASER (Solana), KUCHI (BSC), NF Domains (Algorand) y colaterales.

## 🚀 Inicio Rápido

```bash
# 1. Bootstrap del repo
npm run bootstrap

# 2. Estado del proyecto
npm run status

# 3. Auditorías
npm run audit:env
npm run audit:deps

# 4. Servicios locales
docker compose -f infra/docker/docker-compose.yml up --build

# 5. Frontend manual (alternativo)
cd frontend/dapp && npm run dev

# 6. API manual (alternativo)
cd services/api && uvicorn main:app --reload
```

## 📁 Estructura

```
├── apps/                    # Aplicaciones
│   ├── telegram-bots/      # Bots de Telegram
│   └── mini-apps/          # Mini Apps
├── contracts/              # Contratos inteligentes
│   ├── ton/               # TON (Jetton)
│   ├── solana/            # Solana (SPL)
│   ├── bsc/               # BSC (BEP20)
│   └── algorand/          # Algorand (ASA)
├── services/              # Backend
│   └── api/               # FastAPI
├── frontend/              # Frontend
│   └── dapp/              # Next.js DApp
├── config/                # Configuración
├── infra/                 # Infraestructura
│   ├── docker/            # Docker
│   └── heroku/            # Heroku
└── docs/                  # Documentación
```

## 🔧 Comandos

- `npm run bootstrap` - Configuración inicial
- `npm run status` - Estado del proyecto
- `npm run audit:env` - Auditoría de entorno
- `npm run audit:deps` - Auditoría de dependencias
- `npm run fmt` - Formateo de código

## 🌐 Endpoints

- API: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- Health: `GET /health`
- Price: `GET /index/price`

## 🏦 Índice Fiat y Cálculo del Valor de PANAS Estable

Este proyecto incluye un sistema para calcular el índice fiat diario basado en tres fuentes de datos:

1. FX Oficial (tipo de cambio oficial)
2. FX Paralelo (mercado informal)
3. USDT (precio de stablecoin en mercados cripto)

Pesos predeterminados: 20% oficial, 40% paralelo, 40% USDT.

- Endpoint: `POST /oracles/fx/update`
- Body JSON: `{ "fx_official": 6.96, "fx_parallel": 12.3, "fx_usdt": 12.5 }`
- Persistencia: archivo JSON diario en `services/api/data/fiat_index.json`

Ejemplo rápido con curl:

```bash
curl -X POST http://localhost:8000/oracles/fx/update \
  -H "Content-Type: application/json" \
  -d '{"fx_official":6.96, "fx_parallel":12.3, "fx_usdt":12.5}'
```

## 📊 Tokenomics

Ver `config/tokens.yaml` para pesos y configuración del índice.

## 🛡️ Seguridad

- Pre-commit hooks (black, ruff, prettier)
- CI/CD con GitHub Actions
- Dependabot para actualizaciones
- Auditorías automáticas

## 📝 Estado Actual

Ver `STATUS.md` para el estado actual del proyecto.