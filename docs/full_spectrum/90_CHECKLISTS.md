# Checklists

## Pre-merge checklist
- [ ] Tests pass locally
- [ ] No secrets in changes
- [ ] Owners approved (CODEOWNERS)
- [ ] Runbooks updated if behavior changes

## Release checklist
- [ ] Tag created
- [ ] Release notes written
- [ ] Rollback plan documented
- [ ] Autonomy budget defaults confirmed

## RunPod checklist
- [ ] Volume mounted at /workspace
- [ ] Tokens injected via env, not baked into image
- [ ] Pod has idle shutdown policy
- [ ] Autonomy loop logs stored on volume
