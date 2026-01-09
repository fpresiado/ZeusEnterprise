import { describe, it, expect } from 'vitest';
import { createLogger } from './logger.js';
import fs from 'node:fs';
import path from 'node:path';

describe('logger', () => {
  it('writes to legacy and run logs', () => {
    const dir = path.join(process.cwd(), 'tmp_logs');
    fs.rmSync(dir, { recursive: true, force: true });
    const l = createLogger(dir);
    l.info('hi');
    expect(fs.existsSync(l.legacyPath)).toBe(true);
    expect(fs.existsSync(l.runPath)).toBe(true);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
