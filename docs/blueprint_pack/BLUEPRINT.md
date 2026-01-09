# ZE (Zeus Enterprise) v1.0 — Complete Hybrid Blueprint (Desktop EXE + Local + RunPod)

This blueprint is meant to be *buildable* by a human team without guessing core architecture. It defines the **minimum complete set** of components needed for a production-grade v1.0.

## Truth mode note (non-negotiable)
No one can honestly claim “nothing will ever need to be added” for all time, because requirements, OS versions, and model runtimes change.  
What this blueprint **does** guarantee is: **no core system component is missing** for a ZE v1.0 that meets the acceptance tests in `docs/ACCEPTANCE_TESTS.md`.

---

## 1) Product Goal

ZE is a desktop application (Windows-first EXE; cross-platform capable) that provides:
- A **Chat UI** (streaming)
- **File/document upload** with retrieval and citations
- A **Live Console** panel showing what ZE is doing (logs and tool activity)
- A **Doctor** panel (diagnose + safe auto-fix + guided fix)
- A **Repair** panel (guarded autopatching + rollback + incident bundles)
- A **Model Manager** that can:
  - install/import models (GGUF) and/or
  - connect to local model servers (LM Studio / Ollama / local vLLM) and/or
  - connect to remote GPU servers (RunPod vLLM)
  - auto-select model **or** allow manual override when auto mode is stuck

ZE must be “Replit-Agent-like” in autonomy **only with guardrails**:
- no invented files/APIs
- must reproduce issues
- must test after changes
- must stop when environment/repo is incomplete

---

## 2) Platform & Packaging

### Desktop shell (recommended)
**Tauri v2** (preferred): smaller binaries, stronger security defaults, cross-platform potential.

Fallback: Electron if you prioritize faster iteration over binary size and security surface.

### Local backend (“Orchestrator”)
A local service running on the same machine as the GUI:
- Exposes a localhost API to the GUI
- Runs the agent loop, tools, retrieval, logging, diagnostics, repair, and model routing

---

## 3) Architecture (Required Modules)

### A) Desktop GUI
Panels (must-have):
1. Chat
2. Console (live logs)
3. Model Manager
4. Doctor
5. Repair
6. Projects/Workspaces

### B) Orchestrator Service (Core Brain)
Responsibilities:
- Job queue + task runner
- Tool execution (shell, git, build, test, codegen)
- Model routing (local/remote/auto + manual override)
- Guardrails engine (policies + stop conditions)
- Patch engine (safe apply + rollback)
- Incident bundling (logs + diffs + repro steps)

### C) Model Gateway (Hybrid Runtime Layer)
ZE must support **OpenAI-compatible** runtimes so tooling stays unified:
- vLLM (local or remote)
- LM Studio (OpenAI-compatible local server mode)
- Ollama (OpenAI compatibility or native adapter)
- Optional: llama.cpp server (GGUF local), direct or via adapter

### D) Doctor (Diagnostics + Safe Fixes)
- System checks (CPU/GPU/VRAM, drivers, disk, ports)
- Runtime checks (Node/Python/Git present if required)
- Model checks (endpoint reachable, streaming, context length)
- Workspace checks (repo completeness, required paths, codegen configured)
- Safe auto-fixes: install missing deps, fix ports, create venv, etc.
- Anything risky must become a guided manual step.

### E) Repair Engine (Guarded Auto-Patching)
Strict loop:
1. Reproduce failure (build/test)
2. Parse error into issue objects
3. Propose minimal patch plan
4. Apply patch in sandbox
5. Re-run build/test
6. If pass -> promote
7. If fail -> rollback and report

### F) Document ingestion + retrieval (Upload “like ChatGPT”)
Pipeline:
1. Store raw file
2. Extract text (PDF/DOCX/TXT/MD/CSV/JSON)
3. Chunk
4. Embeddings
5. Index (metadata + vectors)
6. Retrieve with citations for answers

---

## 4) Repo Layout (Canonical)

```
ze/
  apps/
    desktop/                 # Tauri (or Electron) GUI
      src/
        ui/
        state/
        components/
        pages/
      tauri/                 # if Tauri
  services/
    orchestrator/
      src/
        api/                 # localhost API for GUI
        core/
          agent_loop/
          planning/
          execution/
          guardrails/
          diagnostics/
          patching/
        tools/
          shell/
          git/
          build/
          test/
          codegen/
          ingest/
        model_gateway/
          adapters/
            openai_compat/
            ollama/
            llamacpp/
          profiles/
        storage/
          sqlite/
      tests/
  shared/
    types/
    utils/
    prompts/
    policies/
  runtime/
    models/                  # default model storage root
    caches/
    logs/
  scripts/
    doctor/
    build/
    release/
  docs/
    BLUEPRINT.md
    RUNBOOK.md
    ACCEPTANCE_TESTS.md
    SECURITY.md
  workspace.zeus.json        # workspace contract template
  guardrails.json            # guardrails policy template
```

**Rule:** If code imports `@shared/*`, `shared/` must exist in the same repo or be an installed package. No missing monorepo assumptions.

---

## 5) Autonomy Contracts (How ZE avoids “mess repos”)

### Workspace Contract (required)
Every workspace must declare how to install, build, test, and codegen.

See `workspace.zeus.json` template.

### Stop Conditions (required)
ZE must halt autonomy and ask the user when:
- required paths are missing (e.g., `shared/`)
- codegen is not configured but imports depend on generated artifacts
- build errors exceed a threshold (e.g., >100)
- tests can’t run or are undefined
- tool output is inconsistent or incomplete

---

## 6) Model Selection (Auto + Manual Override)

### Model Profiles
Each profile stores:
- provider type: `vllm | lmstudio | ollama | llamacpp | cloud`
- base_url or model_path
- model_id
- max_model_len
- default params
- capabilities: streaming, tool calling, json mode, etc.
- cost tier: local/free vs remote vs paid

### Router Logic (simple and reliable)
- If task requires large context or heavy code analysis -> prefer RunPod (if enabled)
- If quick tasks -> prefer local 6700XT (LM Studio/Ollama)
- If local endpoints unhealthy -> run Doctor -> offer to switch runtime
- Manual override always available: “Force Local / Force RunPod / Force Cloud”

---

## 7) Security & Ownership

- Secrets stored via OS secure storage (DPAPI on Windows)
- No silent outbound network calls
- Explicit permission prompts for:
  - running shell commands
  - writing files
  - applying patches
  - contacting remote endpoints
- Workspace sandboxing: ZE only touches directories the user added

---

## 8) Deliverables (What you hand off to builders)

This zip pack is the minimum “handoff” set:
- `docs/BLUEPRINT.md` (this file)
- `docs/RUNBOOK.md` (how to operate, diagnose, and recover)
- `docs/ACCEPTANCE_TESTS.md` (definition of done)
- `docs/SECURITY.md` (security baseline)
- `workspace.zeus.json` (workspace contract template)
- `guardrails.json` (guardrails policy template)

