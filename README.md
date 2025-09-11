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

## 📊 Tokenomics

Ver `config/tokens.yaml` para pesos y configuración del índice.

## 🛡️ Seguridad

- Pre-commit hooks (black, ruff, prettier)
- CI/CD con GitHub Actions
- Dependabot para actualizaciones
- Auditorías automáticas

## 📝 Estado Actual

Ver `STATUS.md` para el estado actual del proyecto.