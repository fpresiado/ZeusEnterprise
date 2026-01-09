# Autonomy Contract (Replit-style, but real)

Autonomy may:
- read repo
- propose/apply diffs
- run gates (doctor/build/test)
- create incident bundles
- commit fixes

Autonomy may NOT (without human approval):
- add secrets
- change billing
- modify security policy files
- deploy to production
- delete large swaths of code

## Gates (must run every iteration)
1) `pnpm -w doctor`
2) `pnpm -w build`
3) `pnpm -w test`

## Stop conditions
- gates pass twice consecutively with no diff
- budget exceeded
- repeated signature >= 3
- secret leak detected

## Artifact bundle requirements
- autonomy log
- command outputs
- failing stack traces
- git diff + changed files snapshot
- sanitized env report
- reproduction steps
