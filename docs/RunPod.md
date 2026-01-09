# RunPod: Bring-Up (Pod mode) for ZE

This repo is meant to be cloned into your RunPod **/workspace** volume so it persists across restarts.

## 0) Assumptions
- `/workspace` is your persistent volume (standard RunPod templates).  
- Node 20+ and pnpm 9+ available (or installable).
- You will run a **local OpenAI-compatible** endpoint via vLLM for the main model.

## 1) Clone
```bash
cd /workspace
git clone https://github.com/fpresiado/ZeusEnterprise.git ZeusEnterprise
cd ZeusEnterprise
```

## 2) Start vLLM OpenAI-compatible server
vLLM supports an OpenAI-compatible server. Example:
```bash
docker run --runtime nvidia --gpus all \
  -v /workspace/.cache/huggingface:/root/.cache/huggingface \
  -p 8000:8000 --ipc=host \
  vllm/vllm-openai:latest \
  --model Qwen/Qwen2.5-Coder-14B-Instruct
```

## 3) Point Aider at it
Aider can use any OpenAI-compatible endpoint:
```bash
export OPENAI_API_BASE=http://127.0.0.1:8000/v1
export OPENAI_API_KEY=local
```

## 4) Install + verify
```bash
pnpm -w install
node scripts/doctor.mjs
pnpm -w test
```

## 5) Start ZE services
```bash
pnpm -w dev
# api: http://127.0.0.1:8787/health
```

## 6) Start the autonomy loop (guarded)
```bash
bash scripts/runpod_autoloop.sh
```

If it detects policy violations or repeated failures, it writes an incident bundle under `artifacts/incidents/`.
