export type TaskStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export type TaskSpec = {
  id: string;
  name: string;
  input: Record<string, unknown>;
};

export type TaskResult = {
  id: string;
  status: TaskStatus;
  output?: Record<string, unknown>;
  error?: { message: string; stack?: string };
  startedAt?: string;
  finishedAt?: string;
};

export type PluginManifest = {
  id: string;
  version: string;
  description?: string;
  tasks: Array<{ name: string; entry: string }>;
};
