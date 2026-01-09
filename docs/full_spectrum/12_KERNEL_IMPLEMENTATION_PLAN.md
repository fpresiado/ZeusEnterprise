# Kernel Implementation Plan (Blueprint → Build)

This is the step-by-step plan to implement the ZE Kernel modules defined in 11_AI_NATIVE_OS_KERNEL.md.

## Repo modules to add (recommended)
- apps/kernel-api (control plane HTTP API)
- packages/kernel (policy + syscall validation)
- packages/memory (sqlite schema + graph ops + search)
- packages/runner (command runner + artifact creator)
- apps/console (UI: chat + admin)

## Phase 1: Minimal Kernel (2 weeks of work, blueprint complete now)
- Define syscall JSON schema
- Implement policy.check
- Implement capability token verification (ed25519)
- Implement gate runner wrappers
- Emit audit log (JSONL)

Acceptance:
- Can execute gate.run via syscall with Tier2 cap
- Denies forbidden writes
- Produces incident bundles

## Phase 2: Scheduler
- Task queue in sqlite
- Priority + aging
- Preemption via sched.yield
- Run state machine

Acceptance:
- P0 preempts P3
- Budgets enforced per run

## Phase 3: Unified Memory Graph
- Graph tables: nodes, edges
- FTS5 index on Chunk content
- Import/export bundles

Acceptance:
- Search across 10k chats
- Query: patches derived from chat

## Phase 4: Console UI
- Virtualized chat
- Sidebar chat list + search
- Admin panel modules
- Patch upload/apply UI with gate verification

Acceptance:
- 50k+ chunks without UI freeze
- Patch apply produces bundle + rollback point

## RunPod deployment wiring
- Kernel state stored under /workspace
- Runner executes in container; tools installed on demand
- Autonomy uses syscalls not shell scripts directly
