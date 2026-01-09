#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/workspace/ZeusEnterprise}"
ART_DIR="${ART_DIR:-$REPO_DIR/artifacts/autonomy}"
LOOP_MAX="${LOOP_MAX:-20}"

mkdir -p "$ART_DIR" "$REPO_DIR/artifacts/incidents"

cd "$REPO_DIR"

ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

log() { echo "[$(ts)] $*" | tee -a "$ART_DIR/autonomy.log"; }

log "ZE autonomy loop starting in $REPO_DIR"
log "Policy: $(cat autonomy_policy.json | tr -d '\n' | head -c 400)…"

# Safety: refuse to run in / or empty
if [[ "$REPO_DIR" == "/" || -z "$REPO_DIR" ]]; then
  echo "Refusing to run with REPO_DIR=$REPO_DIR" >&2
  exit 2
fi

# Preflight
node scripts/doctor.mjs | tee -a "$ART_DIR/doctor.log" || true

for i in $(seq 1 "$LOOP_MAX"); do
  log "=== ITERATION $i/$LOOP_MAX ==="

  # Run tests first; if failing, ask aider to fix smallest set
  if pnpm -w test | tee -a "$ART_DIR/test_$i.log"; then
    log "Tests pass. Running lint + typecheck + build…"
    pnpm -w lint | tee -a "$ART_DIR/lint_$i.log"
    pnpm -w typecheck | tee -a "$ART_DIR/typecheck_$i.log"
    pnpm -w build | tee -a "$ART_DIR/build_$i.log"
    log "All checks pass. Exiting."
    exit 0
  fi

  log "Tests failed. Running aider repair pass…"
  # Aider invocation expects OPENAI_API_BASE + OPENAI_API_KEY already set.
  # Guardrail: no auto-commits.
  aider --config .aider.conf.yml     --message-file prompts/system.md     --yes-always     --no-git     --log-file "$ART_DIR/aider_$i.log"     .

  # Snapshot changed files
  SNAP="$ART_DIR/snapshot_$i"
  mkdir -p "$SNAP"
  git diff --name-only > "$SNAP/changed_files.txt" || true
  while IFS= read -r f; do
    [[ -f "$f" ]] && cp --parents "$f" "$SNAP/" || true
  done < "$SNAP/changed_files.txt"

done

INC="$REPO_DIR/artifacts/incidents/incident_$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$INC"
cp -r "$ART_DIR" "$INC/autonomy_logs"
log "Loop max reached. Incident bundle at $INC"
exit 1
