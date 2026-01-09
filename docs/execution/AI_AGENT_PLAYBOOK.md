# AI Agent Playbook (STRICT) — ZE Execution

This document is written for **AI agents** (autonomous coders) running on RunPod or similar compute.
If you are an AI agent, you MUST follow this exactly.

Owner priorities (in order):
1) Safety (no runaway spending, no unsafe changes)
2) Correctness (gates pass)
3) Cost control (TOTAL RunPod + model spend MUST be <= $1000)
4) Speed (only after 1-3)

## 0) HARD PROHIBITIONS (NO EXCEPTIONS)
You MUST NOT:
- invent missing requirements
- “assume” unspecified values
- refactor for style
- rewrite large areas “for cleanliness”
- change security/autonomy policy files without explicit owner input
- run unbounded loops
- keep retrying the same failing action more than the allowed limit
- disable tests or gates to make things pass
- increase scope beyond the current phase

If you cannot proceed, you STOP and write to:
- `/docs/execution/OPEN_ITEMS.md`

## 1) COST GOVERNANCE (ANTI-BANK-BREAK RULES)
Total allowable spend across the entire project:
- HARD CAP: $1000 USD (RunPod + model usage + storage)

You MUST enforce:
- Per-run cap (default): $50
- Daily cap (default): $150
- Iteration cap per task (default): 25
- Repeat failure signature cap: 3

If any cap is hit:
1) STOP
2) Create incident bundle
3) Log in WORK_LOG + OPEN_ITEMS
4) Request owner decision

### Required reporting each run
You MUST maintain `/docs/execution/COST_LEDGER.json`:
- provider (runpod / model provider)
- instance type (if known)
- start/end timestamps
- estimated cost
- actual cost (if available)
- remaining budget

If actual cost cannot be measured programmatically:
- estimate cost conservatively using configured hourly rate and wall time
- NEVER underestimate
- Stop early if estimate approaches cap

## 2) AUTONOMY LOOP RULES (NO INFINITE RETRIES)
Autonomy is allowed only under Tier 2 caps.

Loop limits:
- Max iterations: 25
- Max wall time: 120 minutes
- Max repeated failure signature: 3
- Max “same command” retries: 2

If a gate fails:
- You may attempt ONE automatic fix per iteration
- If it fails again with same signature: increment signature counter
- At signature counter 3: STOP and escalate

## 3) PHASE ORDER (LOCKED)
You must execute phases in the order defined in README.
You may not start the next phase until the current phase exit criteria is met.

## 4) REQUIRED GATES (EVERY ITERATION)
Run from repo root:
- `pnpm -w doctor`
- `pnpm -w typecheck`
- `pnpm -w test`
- `pnpm -w build`

Never skip.
Never reduce.
Never bypass.

## 5) ARTIFACTS (MUST PRODUCE)
For every iteration that changes code:
- git commit
- incident bundle or run bundle including:
  - commands run
  - logs
  - diffs/patch
  - reproduction instructions
  - budget estimate

Locations:
- `artifacts/incidents/`
- `artifacts/autonomy/`

## 6) WHAT TO DO WHEN INFO IS MISSING
If you need a decision (stack choice, model choice, deployment choice, etc):
- STOP immediately
- write a single, numbered list of choices in `OPEN_ITEMS.md`
- include pros/cons + cost implications
- include the MINIMUM recommendation
- wait for owner instruction (no further action)

## 7) OUTPUT FORMAT (MANDATORY STATUS)
Every status update must include:

PHASE COMPLETION:
- Phase X: YY%

TASK COMPLETION:
- Task A: YY%

TOTAL PROJECT COMPLETION:
- ZZ%

COST STATUS:
- Spend to date (estimated): $X
- Spend to date (actual, if known): $Y
- Remaining budget: $Z
- Current run burn rate (est): $/hr
- Current run cap: $50

CHANGES SINCE LAST REPORT:
- Bugs fixed:
- Errors encountered:
- Patches applied:
- What fixed what:

OPEN ITEMS:
- Blocking questions (if any)

## 8) “NO DREAMING” DEFINITION
“Dreaming” includes:
- adding features not requested
- changing architecture “because better”
- switching tools/providers without instruction
- chasing speculative improvements
- performing tasks without evidence (tests/logs)

If you cannot prove it with logs and passing gates, it does not count.

END.
