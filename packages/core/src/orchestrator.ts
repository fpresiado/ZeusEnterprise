import { nanoid } from 'nanoid';
import type { TaskResult, TaskSpec } from '@ze/shared';
import { TaskEngine } from './task-engine.js';

export class Orchestrator {
  constructor(private engine: TaskEngine) {}

  async runTask(name: string, input: Record<string, unknown>): Promise<TaskResult> {
    const spec: TaskSpec = { id: nanoid(), name, input };
    return this.engine.run(spec);
  }
}
