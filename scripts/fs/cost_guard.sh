#!/usr/bin/env bash
set -euo pipefail

# Cost guard (estimation-based)
# Requires: jq (recommended). If jq missing, script will still print guidance.

LEDGER="${LEDGER:-docs/execution/COST_LEDGER.json}"
RATE_PER_HOUR="${RATE_PER_HOUR:-0}"    # e.g., 0.99
MODEL_RATE_PER_HOUR="${MODEL_RATE_PER_HOUR:-0}" # optional estimate
RUN_CAP="${RUN_CAP:-50}"
HARD_CAP="${HARD_CAP:-1000}"

START_TS="${START_TS:-}"
END_TS="${END_TS:-}"

if [[ -z "$START_TS" || -z "$END_TS" ]]; then
  echo "ERROR: START_TS and END_TS required (unix epoch seconds)."
  exit 1
fi

WALL_SEC=$((END_TS-START_TS))
if (( WALL_SEC < 0 )); then
  echo "ERROR: END_TS < START_TS"
  exit 1
fi

# Conservative estimate: sum rates
RATE_TOTAL="$(python3 - <<'PY'
import os
r=float(os.environ.get("RATE_PER_HOUR","0") or 0)
m=float(os.environ.get("MODEL_RATE_PER_HOUR","0") or 0)
print(r+m)
PY
)"
EST_COST="$(python3 - <<'PY'
import os, math
wall=int(os.environ["WALL_SEC"])
rate=float(os.environ["RATE_TOTAL"])
print((wall/3600.0)*rate)
PY
)"

echo "Estimated run wall time: ${WALL_SEC}s"
echo "Estimated run cost: $EST_COST (rate/hr=$RATE_TOTAL)"

# Enforce per-run cap
python3 - <<'PY'
import os, sys, json
cap=float(os.environ.get("RUN_CAP","50"))
est=float(os.environ["EST_COST"])
if est > cap:
    print(f"STOP: estimated run cost ${est:.2f} exceeds per-run cap ${cap:.2f}")
    sys.exit(2)
print("OK: under per-run cap")
PY
