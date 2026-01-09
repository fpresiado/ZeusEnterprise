# AI Governance

## Model registry (required)
Maintain `docs/full_spectrum/model_registry.json`:
- provider (local/runpod/openai/etc)
- model name
- context length (claimed + tested)
- cost assumptions
- allowed tasks
- last validation date

## Prompt governance
- Prompt changes require review + prompt regression tests.
- Prompts cannot include secrets.

## Fallback rules
- Local model first
- Cloud fallback only after N failed iterations AND explicit budget check
- Produce warning when budget thresholds hit (80%, 95%, 100%)

## Human override
If ZE cannot prove a fix with tests, it must stop and escalate.
