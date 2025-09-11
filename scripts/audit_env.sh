#!/usr/bin/env bash
set -euo pipefail
echo "=== PANAS ENV AUDIT ==="
echo "# OS & shell"
uname -a
echo "# Python"
python3 --version || true
pip --version || true
echo "# Node"
node -v || true
npm -v || true
echo "# Tools"
docker --version || true
git --version || true
heroku --version || true
vercel --version || true
gh --version || true
echo "# TON/Algorand/Solana CLIs (si instalados)"
tondev --version 2>/dev/null || true
goal version 2>/dev/null || true
solana --version 2>/dev/null || true
echo "OK"
