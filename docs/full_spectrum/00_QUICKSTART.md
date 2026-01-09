# Quickstart (Humans + RunPod)

This repo uses:
- Node 20+
- pnpm (via corepack)
- workspace gates run from repo root

## Local (human dev)
From repo root:
- `corepack enable`
- `pnpm -w install`
- `pnpm -w doctor`
- `pnpm -w typecheck`
- `pnpm -w test`
- `pnpm -w build`

## RunPod (autonomous, Replit-style)
### Requirements
- Persistent volume mounted at `/workspace`
- A Linux image with **Node 20+** (recommended) and git
- Optional: Python 3.10+ if you want Aider in autonomous mode

### Steps
1) In the pod terminal:
   - `export REPO_URL="(your git repo url)"`
   - `bash scripts/fs/runpod_bootstrap.sh`
2) Enable autonomous fixes (optional but you asked for it):
   - `export AIDER_MODEL="(your model name)"`
   - `export AIDER_EXTRA="--yes --no-pretty"`
   - `bash scripts/fs/runpod_autonomy.sh`

## What “done” means (definition of done)
- all gates pass locally
- autonomy loop reaches “two consecutive passes” on RunPod
- checklists satisfied in `docs/full_spectrum/90_CHECKLISTS.md`
