# Governance & Ownership

## Ownership model
- Each app/package must have an owner team and a fallback owner.
- Ownership must be encoded in CODEOWNERS.

## PR rules (minimum)
- No direct pushes to main
- CI must pass
- At least 1 owner approval for touched area
- Security approval required if:
  - auth changes
  - network changes
  - dependency additions
  - autonomy policy changes

## Release policy (minimum)
- Semantic versioning
- Release notes required
- Rollback plan required for production releases

## Decision logs
- Use `docs/full_spectrum/decisions/` for ADRs.
