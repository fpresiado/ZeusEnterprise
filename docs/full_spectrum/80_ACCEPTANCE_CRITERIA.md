# Acceptance Criteria (Humans stop complaining edition)

## Build & Test
- `pnpm -w doctor` passes
- `pnpm -w lint` passes
- `pnpm -w typecheck` passes
- `pnpm -w test` passes
- `pnpm -w build` passes

## Ops
- `/health`, `/ready`, `/version` exist and documented
- runbooks exist and are usable

## Security
- SECURITY.md exists
- threat model documented
- secret scanning in CI or documented alternative

## Governance
- CODEOWNERS exists
- PR rules documented

## Autonomy
- RunPod autonomy loop:
  - produces incident bundles on failure
  - stops on budget limits
  - passes twice consecutively on success

## RunPod
- bootstrap script provisions dependencies
- persistent volume strategy documented
