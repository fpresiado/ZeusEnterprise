import { describe, it, expect } from 'vitest';
import { requireTrue, summarize } from './gates.js';

describe('eval gates', () => {
  it('summarizes', () => {
    const s = summarize([requireTrue('a', true), requireTrue('b', true)]);
    expect(s.pass).toBe(true);
  });
});
