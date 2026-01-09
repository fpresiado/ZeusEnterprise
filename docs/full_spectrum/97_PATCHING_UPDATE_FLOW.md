# Patching & Update Flow (Push / Upload Patch)

This defines how you can upload a patch to ZE, or generate one from RunPod/Replit, and apply it safely.

## Patch bundle format (ZIP)
- `manifest.json`
  - patch_id (uuid)
  - created_at
  - author
  - base_git_sha (required)
  - files[] (paths + sha256)
  - instructions (human readable)
- `changes.patch` (git patch)
- `gates/` (optional pre-run logs)
- `signature/` (optional; recommended)
  - `sig.txt` (signature)
  - `pubkey.txt` (verifier key)

## Apply flow (safe)
1) Verify base sha matches repo (or stop)
2) Create snapshot:
   - git branch `patch/<id>`
   - copy incident bundle skeleton
3) Apply patch
4) Run gates:
   - `pnpm -w doctor`
   - `pnpm -w typecheck`
   - `pnpm -w test`
   - `pnpm -w build`
5) If pass:
   - merge PR or fast-forward (policy choice)
6) If fail:
   - keep branch
   - emit incident bundle
   - offer rollback

## Where patches come from
- You (manual)
- RunPod autonomy loop (auto-generated commits)
- Replit agent (export patch)
- Any other assistant (as long as it produces a patch bundle)

## Non-negotiables
- Never apply a patch that adds secrets
- Never apply a patch that changes autonomy security rules without human approval
