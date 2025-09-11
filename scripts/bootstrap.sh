#!/usr/bin/env bash
set -euo pipefail
echo "Bootstrap repo…"
git lfs install || true
# gitattributes / gitignore ya presentes
chmod +x scripts/*.sh || true
if [ -f package.json ]; then npm i; fi
echo "Instalando pre-commit…"
pip install pre-commit || true
cat > .pre-commit-config.yaml <<'YAML'
repos:
  - repo: https://github.com/psf/black
    rev: 24.8.0
    hooks: [{id: black}]
  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.6.9
    hooks: [{id: ruff}]
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.3.3
    hooks: [{id: prettier}]
YAML
pre-commit install || true
echo "Bootstrap OK."
