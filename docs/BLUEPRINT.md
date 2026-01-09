# ZE Blueprint (RunPod-first, Replit-like autonomy)

This repo is designed to behave like an *autonomous* Replit-style agent environment:
- reproducible workspace
- a single command to run checks
- a guarded autonomy loop that can iterate until tests pass
- incident bundles when it fails

## What is "complete" here?
“Complete” means **all core organs exist** and the repo can:
1) boot, 2) run tests, 3) run a guarded loop, 4) produce artifacts you can audit.

It does **not** mean “no future features ever”. Humans will always request more. 🙃

## Core organs (must exist)
- `apps/api`: runtime control surface (`/health`, task intake)
- `apps/web`: minimal UI shell + smoke test
- `packages/core`: orchestrator + task engine
- `packages/tools`: logging (dual file, per-run)
- `packages/shared`: shared types/schemas
- `prompts/`: system prompt(s) for autonomy
- `scripts/`: doctor + runpod_autoloop
- `docs/`: acceptance tests, security, ops

## Definition of Done
See `docs/blueprint_pack/ACCEPTANCE_TESTS.md` and run:
- `node scripts/doctor.mjs`
- `pnpm -w lint`
- `pnpm -w typecheck`
- `pnpm -w test`
- `pnpm -w build`

## RunPod bring-up
See `docs/RunPod.md`.
