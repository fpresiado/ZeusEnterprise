#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/workspace/ZeusEnterprise}"
ART_DIR="${ART_DIR:-$REPO_DIR/artifacts/autonomy}"
INC_DIR="${INC_DIR:-$REPO_DIR/artifacts/incidents}"

# Budget controls
LOOP_MAX="${LOOP_MAX:-25}"
WALL_MAX_MIN="${WALL_MAX_MIN:-120}"
FAIL_SIG_MAX="${FAIL_SIG_MAX:-3}"

# Aider controls (you must configure these)
AIDER_MODEL="${AIDER_MODEL:-}"
AIDER_EXTRA="${AIDER_EXTRA:-}"

mkdir -p "$ART_DIR" "$INC_DIR"
cd "$REPO_DIR"

# Cost governance (estimation-based). Set RATE_PER_HOUR for RunPod GPU instance.
RATE_PER_HOUR="${RATE_PER_HOUR:-0}"
MODEL_RATE_PER_HOUR="${MODEL_RATE_PER_HOUR:-0}"
RUN_CAP_USD="${RUN_CAP_USD:-50}"
HARD_CAP_USD="${HARD_CAP_USD:-1000}"

ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
log() { echo "[$(ts)] $*" | tee -a "$ART_DIR/fs_autonomy.log"; }

start_epoch="$(date +%s)"
fail_sig=""
fail_sig_count=0

gate() {
  local name="$1"
  shift
  log "GATE START: $name"
  if "$@" 2>&1 | tee "$ART_DIR/${name}.log"; then
    log "GATE PASS: $name"
    return 0
  else
    log "GATE FAIL: $name"
    return 1
  fi
}

incident_bundle() {
  local tag="$1"
  local inc="$INC_DIR/incident_${tag}_$(date -u +%Y%m%dT%H%M%SZ)"
  mkdir -p "$inc"
  git status --porcelain > "$inc/git_status.txt" || true
  git diff > "$inc/git_diff.patch" || true
  cp -r "$ART_DIR" "$inc/autonomy_logs" || true
  echo "REPRO:" > "$inc/repro.txt"
  echo "  pnpm -w doctor" >> "$inc/repro.txt"
  echo "  pnpm -w build" >> "$inc/repro.txt"
  echo "  pnpm -w test" >> "$inc/repro.txt"
  log "Incident bundle created: $inc"
}

aider_fix() {
  if [[ -z "$AIDER_MODEL" ]]; then
    log "AIDER_MODEL not set. Skipping automatic fix."
    return 1
  fi
  log "Running Aider with model=$AIDER_MODEL"
  # Expect aider installed in the image or via pip.
  aider --model "$AIDER_MODEL" $AIDER_EXTRA .
}

for i in $(seq 1 "$LOOP_MAX"); do
  now="$(date +%s)"
  elapsed_min=$(( (now - start_epoch) / 60 ))
  if (( elapsed_min >= WALL_MAX_MIN )); then
    log "Budget stop: wall clock ${elapsed_min}m >= ${WALL_MAX_MIN}m"
    incident_bundle "budget_wall"
    exit 2
  fi

  log "=== ITERATION $i/$LOOP_MAX ==="

  if gate "doctor" pnpm -w doctor && gate "build" pnpm -w build && gate "test" pnpm -w test; then
    # pass twice consecutively w/ no changes
    if [[ -z "$(git status --porcelain)" ]]; then
      log "Clean pass (no diff). Running one more verification pass."
      if gate "doctor_verify" pnpm -w doctor && gate "build_verify" pnpm -w build && gate "test_verify" pnpm -w test; then
        log "SUCCESS: two consecutive passes."
        exit 0
      fi
    fi
    log "Gates passed but working tree not clean. Committing."
    git add -A
    git commit -m "fix(autonomy): iteration $i" || true
    continue
  fi

  # failure signature heuristic: first failing gate log last 30 lines
  sig_src="$(tail -n 30 "$ART_DIR/doctor.log" 2>/dev/null || true)"
  if [[ -z "$sig_src" ]]; then sig_src="$(tail -n 30 "$ART_DIR/build.log" 2>/dev/null || true)"; fi
  if [[ -z "$sig_src" ]]; then sig_src="$(tail -n 30 "$ART_DIR/test.log" 2>/dev/null || true)"; fi
  sig="$(echo "$sig_src" | sha256sum | awk '{print $1}')"

  if [[ "$sig" == "$fail_sig" ]]; then
    fail_sig_count=$((fail_sig_count+1))
  else
    fail_sig="$sig"
    fail_sig_count=1
  fi

  log "Failure signature count: $fail_sig_count/$FAIL_SIG_MAX"
  if (( fail_sig_count >= FAIL_SIG_MAX )); then
    log "Stop: repeated failure signature reached."
    incident_bundle "repeated_signature"
    exit 3
  fi

  incident_bundle "iter${i}"
  # attempt fix
  if aider_fix; then
    git add -A || true
    git commit -m "fix(autonomy): auto-fix iter $i" || true
  else
    log "No automatic fix performed. Exiting for human."
    exit 4
  fi

  # Optional cost guard (estimation). If you set RATE_PER_HOUR, we enforce per-run caps.
  if [[ "${RATE_PER_HOUR}" != "0" && "${RATE_PER_HOUR}" != "0.0" ]]; then
    START_TS="${start_epoch}"
    END_TS="$(date +%s)"
    WALL_SEC=$((END_TS-START_TS))
    export START_TS END_TS WALL_SEC RATE_PER_HOUR MODEL_RATE_PER_HOUR RUN_CAP="${RUN_CAP_USD}" HARD_CAP="${HARD_CAP_USD}"
    if ! bash scripts/fs/cost_guard.sh; then
      log "Cost guard stop triggered."
      incident_bundle "cost_guard"
      exit 5
    fi
  fi

done

log "Loop max reached."
incident_bundle "loop_max"
exit 1
