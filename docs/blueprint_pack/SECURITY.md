# ZE v1.0 — Security Baseline

This document defines the minimum security expectations for ZE v1.0.

## 1) Secrets
- Store API keys and credentials using OS secure storage:
  - Windows: DPAPI/Credential Manager
  - macOS: Keychain
  - Linux: Secret Service (where available)
- Do not write secrets to logs.
- Provide a “redact before export” step for incident bundles.

## 2) Network
- Default to local-only.
- Any remote endpoint (RunPod, cloud) must be explicitly configured.
- The UI must show clearly when ZE is connected to a remote runtime.

## 3) Tool Execution
- Maintain an allowlist:
  - shell commands
  - file write scopes
  - git operations
- Provide a safe mode that disables all execution.

## 4) Updates
- Signed updates only.
- Rollback if update fails.

## 5) Workspace Isolation
- ZE can only read/write within user-approved workspace directories.
- Keep runtime/cache/logs separated from workspaces.

