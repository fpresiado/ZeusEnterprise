#!/usr/bin/env bash
set -euo pipefail

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 not found. Install Python 3.10+ in the image first."
  exit 1
fi

python3 -m pip install -U pip
python3 -m pip install -U aider-chat

echo "aider installed."
aider --version || true
