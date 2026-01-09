import { describe, it, expect } from 'vitest';
import { TaskEngine } from './task-engine.js';
import { Orchestrator } from './orchestrator.js';

describe('core orchestrator', () => {
  it('runs hello task', async () => {
    const engine = new TaskEngine();
    engine.register('hello-world', async (spec) => ({ hello: spec.input.name ?? 'world' }));
    const orch = new Orchestrator(engine);
    const res = await orch.runTask('hello-world', { name: 'ZE' });
    expect(res.status).toBe('succeeded');
    expect(res.output?.hello).toBe('ZE');
  });
});
