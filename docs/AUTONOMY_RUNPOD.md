# RunPod Autonomy Loop

Goal: run iterative Aider loops **safely**.

## Requirements
- Persistent volume mounted at `/workspace`
- Repo cloned into `/workspace/ZeusEnterprise`
- Aider configured to use your chosen LLM endpoint

## Loop contract
Each iteration MUST:
1. Run `pnpm -w doctor`
2. Run `pnpm -w build`
3. Run `pnpm -w test`
4. If failure: create artifact bundle:
   - logs
   - failing command output
   - git diff
   - environment snapshot
5. Commit fix with message `fix(loop): <summary>`

Stop conditions:
- CI gate passes twice consecutively
- Or budget/time limits reached
- Repeated failure on same signature 3 times -> escalate (requires human choice)

See `scripts/runpod_autoloop.sh`.
