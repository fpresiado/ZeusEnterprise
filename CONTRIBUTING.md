# Contributing

## Ground rules (so humans don’t suffer)
- No direct pushes to `main`
- Small PRs preferred
- Every change must pass gates:
  - `pnpm -w doctor`
  - `pnpm -w typecheck`
  - `pnpm -w test`
  - `pnpm -w build`

## Security
- Never commit secrets
- Autonomy policy / security files require security owner review

## Commit style
- `feat: ...`
- `fix: ...`
- `chore: ...`
- `docs: ...`
