# Syscall Registry

This file enumerates all supported syscalls and their required capability grants.

## Filesystem
- fs.read (requires grant: fs.read scope path)
- fs.write (requires grant: fs.write scope path; deny list enforced)
- fs.list (fs.list)
- fs.search (fs.search)

## Git
- git.status
- git.diff
- git.commit
- git.branch
- git.checkout
- git.apply_patch

## Gates
- gate.run (allowed gate names only)
- gate.parse

## Tools
- tool.aider (requires tool.aider grant; scope restricted)
- tool.llm_call (requires tool.llm_call; prompt refs only)

## Security
- policy.check (kernel internal)
- secrets.scan (required before patch bundle finalize)

## Artifacts
- artifact.create_incident
- artifact.create_patch_bundle
- artifact.snapshot

## Scheduler
- sched.enqueue
- sched.yield
- sched.block
- sched.escalate_human
