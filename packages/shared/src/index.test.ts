import { describe, it, expect } from 'vitest';
import { ZE_SCHEMA_VERSION } from './schema.js';

describe('shared', () => {
  it('exposes schema version', () => {
    expect(ZE_SCHEMA_VERSION).toMatch(/\d+\.\d+\.\d+/);
  });
});
