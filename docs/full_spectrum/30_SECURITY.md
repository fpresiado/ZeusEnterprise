# Security (minimum enterprise baseline)

## Security contacts
- Security Owner: <fill>
- Incident hotline: <fill>

## Reporting
- Use `SECURITY.md` in repo root for disclosure process.

## Threat model (summary)
Primary threats:
1) Prompt injection via task content
2) Secret leakage via logs/diffs
3) Dependency supply-chain
4) Unbounded autonomy spending
5) Unauthorized file access

## Required controls
- Secret scanning (pre-commit + CI)
- No secrets in prompts, logs, diffs, or issue text
- Least-privilege tokens
- Autonomy cannot edit security policy files without human approval

## RunPod-specific controls
- Use short-lived tokens
- Never bake tokens into images
- Mount volume with correct permissions
- Shut down idle pods automatically
