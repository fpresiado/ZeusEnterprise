# RunPod AI Start (Cost-Safe)

## Required env vars (set before autonomy)
- REPO_URL="your git repo url"
- RATE_PER_HOUR="your RunPod hourly cost for the pod" (example: 0.99)
- RUN_CAP_USD="50" (default)
- HARD_CAP_USD="1000" (default)

Optional:
- MODEL_RATE_PER_HOUR="estimated model spend per hour" (if using paid endpoint)
- INSTALL_AIDER=1
- AIDER_MODEL="your model id"
- AIDER_EXTRA="--yes --no-pretty"

## Steps
1) Bootstrap:
   `bash scripts/fs/runpod_bootstrap.sh`

2) Read the AI rules:
   `cat docs/execution/AI_AGENT_PLAYBOOK.md`

3) Start autonomy:
   `bash scripts/fs/runpod_autonomy.sh`

If cost guard stops you, do NOT keep retrying. Log it and escalate per playbook.
