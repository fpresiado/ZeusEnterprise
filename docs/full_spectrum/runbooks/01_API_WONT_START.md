# Runbook: API won't start

## Symptoms
- `pnpm -w dev` fails
- container exits
- `/health` unreachable

## Containment
- stop autonomy loop
- capture logs in incident bundle

## Diagnose
- `pnpm -w doctor`
- `pnpm -w -C apps/api typecheck`
- `pnpm -w -C apps/api test`

## Fix
- revert last changes
- re-run gates

## Verify
- `curl -s localhost:<port>/health`
