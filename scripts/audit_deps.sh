#!/usr/bin/env bash
set -euo pipefail
echo "=== DEP AUDIT PYTHON ==="
if [ -d services/api ]; then
  cd services/api
  if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
  pip install pip-audit safety || true
  pip-audit || true
  safety check || true
  cd - >/dev/null
fi
echo "=== DEP AUDIT NODE ==="
if [ -d frontend/dapp ]; then
  cd frontend/dapp
  if [ -f package.json ]; then npm ci || npm i; npm audit || true; fi
  cd - >/dev/null
fi
echo "=== DOCKER SCAN (opcional) ==="
docker scout quickview || true
echo "Listo."
