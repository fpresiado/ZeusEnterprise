# Admin Panel Spec (ZE Admin)

Goal: a control center to manage:
- models (local/runpod/cloud)
- autonomy policies + budgets
- task runs + incidents
- patches/updates
- users/roles (even if single-user today)

## Core modules
1) Dashboard
- current model
- autonomy status (running/stopped)
- budget meter (iterations/time/cost)
- last incident summary

2) Runs
- list of autonomy runs with filters
- each run shows gates, diffs, links to incident bundles

3) Incidents
- searchable incident bundles
- “reproduce locally” instructions
- redaction status (secrets scan)

4) Models
- edit `docs/full_spectrum/model_registry.json` via UI
- validate model connectivity
- set default + fallback

5) Policies
- autonomy tier (0/1/2/3)
- stop conditions
- forbidden file patterns (security)
- allowed commands whitelist

6) Updates / Patches
- upload patch bundle (signed)
- apply to repo working tree
- run gates automatically
- rollback to previous snapshot

## Roles (minimum)
- Owner/Admin
- Operator
- Read-only

## Acceptance
- any policy change recorded (audit log)
- any patch apply produces a bundle (diff, gates, rollback info)
