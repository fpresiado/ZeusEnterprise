import type { TaskResult, TaskSpec } from '@ze/shared';

export type TaskHandler = (spec: TaskSpec) => Promise<Record<string, unknown>>;

export class TaskEngine {
  private handlers = new Map<string, TaskHandler>();

  register(name: string, handler: TaskHandler) {
    if (this.handlers.has(name)) throw new Error(`Task already registered: ${name}`);
    this.handlers.set(name, handler);
  }

  async run(spec: TaskSpec): Promise<TaskResult> {
    const startedAt = new Date().toISOString();
    const handler = this.handlers.get(spec.name);
    if (!handler) {
      return {
        id: spec.id,
        status: 'failed',
        error: { message: `No handler registered for task: ${spec.name}` },
        startedAt,
        finishedAt: new Date().toISOString(),
      };
    }

    try {
      const output = await handler(spec);
      return {
        id: spec.id,
        status: 'ok',
        output,
        startedAt,
        finishedAt: new Date().toISOString(),
      };
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      return {
        id: spec.id,
        status: 'failed',
        error: { message: err.message, stack: err.stack },
        startedAt,
        finishedAt: new Date().toISOString(),
      };
    }
  }
}
