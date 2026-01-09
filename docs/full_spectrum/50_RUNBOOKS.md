# Runbooks (minimum)

Runbooks must exist for:
1) API won't start
2) Build fails in CI
3) Autonomy loop stuck repeating
4) Secret leak detected
5) RunPod cost runaway
6) Model endpoint down

Each runbook must include:
- Symptoms
- Immediate containment
- Diagnosis commands
- Fix steps
- Verification steps
- Rollback steps
