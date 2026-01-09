#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-}"
REPO_DIR="${REPO_DIR:-/workspace/ZeusEnterprise}"

if [[ -z "$REPO_URL" ]]; then
  echo "ERROR: Set REPO_URL to your git repo URL (https or ssh)."
  exit 1
fi

mkdir -p /workspace
cd /workspace

if [[ ! -d "$REPO_DIR/.git" ]]; then
  git clone "$REPO_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"

# Install deps
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node not found. Use a RunPod image that includes Node 20+ or install it before running."
  exit 1
fi

corepack enable || true
pnpm -w install
pnpm -w doctor

# Optional: install aider if requested
if [[ "${INSTALL_AIDER:-0}" == "1" ]]; then
  bash scripts/fs/install_aider.sh
fi

echo "Bootstrap complete."
