# ZE v1.0 — Acceptance Tests (Definition of Done)

ZE v1.0 is considered complete only if these tests pass.

---

## 1) Install & Launch
- [ ] Windows installer produces `ZE.exe` that launches successfully.
- [ ] App opens without external browser requirement.
- [ ] Console panel shows logs immediately.

## 2) Core UI
- [ ] Chat panel streams tokens.
- [ ] Console panel shows tool activity timeline.
- [ ] Model Manager can add/edit/remove a model profile.
- [ ] Doctor can run checks and produce RED/YELLOW/GREEN.
- [ ] Repair panel can show a proposed plan and diff preview.
- [ ] Projects panel can add a workspace directory.

## 3) Local Model Connectivity
At least one local runtime must work:
- [ ] LM Studio OpenAI-compatible endpoint OR
- [ ] Ollama adapter/compatibility OR
- [ ] llama.cpp GGUF local

Validation:
- [ ] `/v1/models` works (if OpenAI-compatible)
- [ ] A chat completion test returns output
- [ ] Streaming works

## 4) Remote Model Connectivity (RunPod vLLM)
- [ ] User can add a remote vLLM endpoint profile.
- [ ] Health check succeeds.
- [ ] Chat completion succeeds.
- [ ] UI shows active remote cost warning/gate.

## 5) Hybrid Router
- [ ] Auto mode chooses local for small tasks if local healthy.
- [ ] Auto mode chooses remote for large tasks if configured and allowed.
- [ ] Manual override works (Force Local / Force Remote).

## 6) Doctor Enforcement
- [ ] If required paths are missing (e.g., `shared/`), ZE blocks Repair.
- [ ] If codegen is required but undefined, ZE blocks Repair and prompts to configure.
- [ ] If build errors exceed threshold, ZE blocks autopatching and requests structural fix.

## 7) Repair Engine (Controlled Test)
Provide a small test workspace with:
- one failing test OR
- one deterministic TypeScript build error

ZE must:
- [ ] reproduce failure
- [ ] propose minimal patch
- [ ] apply patch in sandbox
- [ ] rerun build/test
- [ ] succeed and promote, or fail and rollback

## 8) Document Ingestion + Citations
- [ ] Upload PDF/DOCX/TXT works.
- [ ] Text extraction succeeds.
- [ ] Retrieval cites sources (file name + chunk/page reference).
- [ ] Chat can answer questions grounded in uploaded documents.

## 9) Incident Bundle
- [ ] Export produces a single bundle containing:
  - incident summary
  - logs
  - repro steps
  - diff patch (if any)
  - environment snapshot

## 10) Security Baseline
- [ ] Secrets stored via OS secure storage (not plaintext).
- [ ] No silent outbound network calls.
- [ ] Tool execution requires explicit permission configuration.
