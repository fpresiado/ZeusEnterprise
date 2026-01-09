# AI-Native OS Kernel Blueprint (ZE Kernel)

This document completes the remaining “kernel layer” that turns ZE from a full-spectrum AI system into an AI-native OS blueprint.

Core idea:
- Everything ZE does is expressed as audited “syscalls”.
- Every syscall is authorized by capability tokens.
- Work is scheduled by a kernel scheduler, not ad-hoc loops.
- Memory is a unified graph linking chats, tasks, patches, incidents, and files.
- Execution is reproducible: the same inputs produce the same observable artifacts (or a controlled divergence with logged reasons).

---

## 1) Kernel Objects (first-class primitives)

### 1.1 Task
Represents a unit of intent.
Fields:
- task_id (uuid)
- title
- type: fix | feature | refactor | investigate | release | docs | security
- priority: P0..P4
- state: queued | running | blocked | needs_human | done | failed
- created_at / updated_at
- sources: [chat_id, issue_id, file_path, incident_id]
- constraints: budgets, allowed_scopes, forbidden_paths
- desired_outcome: acceptance criteria

### 1.2 Plan
A deterministic plan for a task.
- plan_id
- task_id
- steps[] (each step maps to syscalls)
- assumptions[]
- risks[]
- rollback_strategy

### 1.3 Run
An execution instance for a plan.
- run_id
- task_id
- plan_id
- started_at / ended_at
- model_id
- cost_estimate
- budgets_applied
- status
- artifacts: incident bundles, patches, logs

### 1.4 Artifact
A durable object stored in `artifacts/`:
- incident bundle
- patch bundle
- run log bundle
- build/test outputs snapshot
- model trace (sanitized)

### 1.5 Capability Token
A signed permission grant used by the kernel to authorize syscalls.

---

## 2) Syscall Interface (AI syscalls)

ZE Kernel exposes an explicit syscall API. AI “thought” is not trusted; only syscalls are executed.

### 2.1 Syscall format (JSON)
Every syscall is a single JSON object written to the kernel runner:

{
  "id": "uuid",
  "ts": "ISO",
  "actor": "ze-agent|human",
  "cap": "capability_token_id",
  "call": "fs.read",
  "args": { ... },
  "reason": "why this is needed",
  "expected": "what success looks like"
}

### 2.2 Core syscall categories

#### Filesystem
- fs.read {path, max_bytes}
- fs.write {path, content, mode}
- fs.list {path, depth}
- fs.hash {path}
- fs.search {query, paths[], max_hits}

#### Git
- git.status {}
- git.diff {staged:false}
- git.commit {message}
- git.branch {name}
- git.checkout {ref}
- git.apply_patch {patch_path}

#### Build/Test Gates
- gate.run {name: doctor|typecheck|test|build, cmd, timeout_sec}
- gate.parse {name, log_path} -> structured failures

#### Tooling (Aider / other agents)
- tool.aider {model, args[], scope_paths[]}
- tool.llm_call {provider, model, prompt_ref, inputs_ref}

#### Policy/Security
- policy.check {call, args} -> allow/deny + rationale
- secrets.scan {paths[]} -> findings + redactions

#### Artifacts
- artifact.create_incident {tag}
- artifact.create_patch_bundle {base_sha, patch_path}
- artifact.snapshot {label}

#### Scheduler
- sched.enqueue {task_ref}
- sched.yield {reason}
- sched.block {depends_on}
- sched.escalate_human {options[]}

---

## 3) Capability Tokens (enforced permission model)

### 3.1 Token model
A capability token is a signed JSON document:
{
  "cap_id": "uuid",
  "issued_at": "ISO",
  "expires_at": "ISO",
  "subject": "ze-agent",
  "grants": [
    {"call":"fs.read", "scope":["repo/**"]},
    {"call":"fs.write", "scope":["repo/apps/**","repo/packages/**"], "deny":["**/SECURITY.md","repo/**/.env*"]},
    {"call":"gate.run", "scope":["doctor","typecheck","test","build"]}
  ],
  "constraints": {
    "max_wall_min": 120,
    "max_iterations": 25,
    "max_patch_files": 200
  },
  "signature": "ed25519..."
}

### 3.2 Default caps by autonomy tier
Tier 0 (read-only): fs.read, fs.list, fs.search, git.status, gate.run (optional)
Tier 1 (propose): Tier0 + artifact.create_patch_bundle (no apply)
Tier 2 (apply): Tier1 + fs.write (scoped) + git.apply_patch + git.commit
Tier 3 (infra): DISABLED by default. Separate cap issuer required.

### 3.3 Non-negotiable denies
No cap may allow:
- writing to `.env*`
- changing `SECURITY.md` and security policy files without human cap
- exfiltration of secrets to logs/artifacts

---

## 4) Scheduler (preemptive, priority-aware)

### 4.1 Scheduling objectives
- Prioritize safety + correctness over speed
- Preempt low priority tasks when P0/P1 appears
- Prevent starvation: aging boosts long-waiting tasks
- Enforce budgets per run

### 4.2 State machine
queued -> running -> {blocked|needs_human|done|failed}

### 4.3 Preemption rules
If a task with higher priority arrives:
- kernel issues sched.yield for current run
- snapshots artifacts
- resumes later

### 4.4 Determinism
Scheduler decisions must be logged:
- why preempted
- budgets used
- next scheduled task

---

## 5) Unified Memory Graph (kernel memory)

### 5.1 Graph nodes
- Chat
- Message
- Chunk (paragraph)
- Task
- Plan
- Run
- Incident
- Patch
- File
- Decision (ADR)
- Model

### 5.2 Graph edges
- derived_from (patch -> task)
- caused_by (incident -> run)
- references (chat_chunk -> task)
- modifies (patch -> file)
- supersedes (decision -> decision)
- validates (gate_result -> patch)

### 5.3 Storage
Blueprint supports:
- SQLite (local-first) with FTS5 for search
- Optional sync via encrypted bundles

### 5.4 Query examples
- “show all patches derived from chat X”
- “find incidents caused by model Y”
- “list files most often modified in failing runs”

---

## 6) Kernel Services (what runs where)

### 6.1 ze-kernel (control plane)
- validates syscalls
- enforces caps
- writes audit log
- triggers tool runners

### 6.2 ze-runner (execution plane)
- executes allowed commands
- collects outputs
- creates artifacts

### 6.3 ze-memory (storage plane)
- stores graph + search index
- import/export bundles

### 6.4 ze-console (UI)
- chat UI (virtualized)
- admin panel
- run/incident viewers
- patch upload/apply UI

---

## 7) RunPod mapping

RunPod is compute. Kernel state must be on persistent volume.

- `/workspace` (persistent):
  - repo
  - artifacts
  - memory DB (sqlite)
  - audit logs
- ephemeral container:
  - tool installs
  - temp build outputs

RunPod autonomy loop becomes:
- sched selects task
- plan created
- syscalls executed under Tier 2 cap
- gates run
- patch produced + committed
- incident emitted on failure

---

## 8) Definition of Done (Kernel layer)
Kernel blueprint is “complete” when:
- syscalls are explicit and auditable
- capability tokens define and enforce permissions
- scheduler rules exist (preemptive + budgets)
- memory graph schema exists (nodes/edges + queries)
- RunPod mapping is defined for persistence + safety
