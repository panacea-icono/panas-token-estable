#!/usr/bin/env bash
set -euo pipefail
STAGE="${1:-PLANIFICACION}" # PLANIFICACION | DESARROLLO | QA | PRODUCCION
cat > STATUS.md <<MD
# Estado del Proyecto
- Etapa: ${STAGE}
- Fecha: $(date -u +"%Y-%m-%d %H:%M UTC")
- Descripcion: PANAS Token Estable multi-índice/multi-activo (TON, Algorand NF Domains, Solana VASER, BSC KUCHI).
MD
echo "STATUS actualizado a ${STAGE}"
