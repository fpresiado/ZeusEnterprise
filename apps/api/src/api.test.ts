import { describe, it, expect } from 'vitest';
import { TaskEngine, Orchestrator } from '@ze/core';

describe('api wiring', () => {
  it('orchestrator wiring works', async () => {
    const engine = new TaskEngine();
    engine.register('x', async () => ({ ok: true }));
    const o = new Orchestrator(engine);
    const r = await o.runTask('x', {});
    expect(r.status).toBe('succeeded');
  });
});
