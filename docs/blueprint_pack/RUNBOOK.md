# ZE v1.0 — Runbook (Operations + Troubleshooting)

This runbook is for humans (and ZE itself) to operate and recover the system.

---

## 1) Start/Stop

### Desktop app
- Start ZE from the installed EXE.
- The GUI must show:
  - Chat panel
  - Console panel (live logs)
  - Model status

### Orchestrator
- Runs as a local service.
- Exposes localhost API to GUI.
- Must auto-restart if it crashes (within reason) and report crash reason in Console.

---

## 2) Model Runtime Modes

ZE supports multiple runtime modes. Only one needs to be active to chat, but routing uses several if configured.

### Mode A: Local OpenAI-compatible endpoint
- LM Studio server (OpenAI compatible)
- Local vLLM (if available)
- Ollama (via adapter or OpenAI compatibility)

### Mode B: Remote OpenAI-compatible endpoint (RunPod vLLM)
- Connect via base_url
- Health check:
  - GET /v1/models
  - test chat completion
- Budget gating must be visible in UI

### Mode C: Local GGUF (llama.cpp)
- ZE can spawn a local server and connect through adapter.

---

## 3) Doctor: Standard Procedure

Run Doctor when:
- model fails to load
- endpoint unreachable
- build/test fails unexpectedly
- autonomy is “stuck” or inconsistent

Doctor checks:
1. System: disk, permissions, ports
2. Runtime: git/node/python presence (if required)
3. Model: endpoint health, streaming, ctx length
4. Workspace: required paths, codegen config, alias config

Doctor outputs:
- RED: blocked, must fix first
- YELLOW: degraded, can proceed with caution
- GREEN: healthy

Doctor actions:
- Safe auto-fix (non-destructive): install missing runtime, fix PATH, create venv, etc.
- Guided fix (destructive/risky): only with explicit user approval.

---

## 4) Repair: Standard Procedure

Repair is allowed only when:
- workspace contract exists
- build/test commands are defined
- required paths exist
- codegen is defined if required

Repair loop:
1. Reproduce: run build/test
2. Extract: parse errors into issue objects
3. Plan: minimal patch steps
4. Apply: sandbox patch (rollback ready)
5. Verify: run build/test again
6. Promote: if green, promote patch
7. Bundle: export incident bundle for audit

If Repair sees:
- missing `shared/` or missing generated artifacts
It must stop and route to Doctor/workspace bootstrap.

---

## 5) Incident Bundle Format

When ZE fails or applies patches, it must be able to export a single bundle:
- `incident.json` (structured summary)
- `console.log` (human readable)
- `console.jsonl` (structured logs)
- `repro_steps.txt`
- `diff.patch` (if patch attempted/applied)
- `env_snapshot.json` (runtime versions, model profile, workspace config)

---

## 6) Cost Control (Remote GPU)

Rules:
- Remote runtimes must display “RUNNING COST” indicator in UI.
- Auto-mode must prefer local if the task is small and local is healthy.
- If remote endpoint is idle for N minutes, ZE should prompt to stop/pause it.
- ZE never auto-enables paid fallback without explicit user approval.

---

## 7) Common Failures & Correct Responses

### A) “Repo not in git” / tooling can’t diff
- Initialize git locally OR use patch staging area.
- ZE should prefer git-based diffs for traceability.

### B) Missing monorepo paths like `@shared/*`
- Treat as structural blocker.
- Doctor must detect missing required paths.
- Repair must NOT try to “fix” thousands of errors.

### C) Codegen missing (Drizzle/Prisma/etc)
- Doctor routes to “run codegen” command from workspace contract.
- Then rebuild before any edits.

### D) Model OOM or slow
- Doctor suggests:
  - smaller context
  - quantized variant
  - route to remote
  - swap runtime

