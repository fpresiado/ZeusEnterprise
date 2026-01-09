import { describe, it, expect } from 'vitest';
import { SqliteKV } from './sqlite-kv.js';
import fs from 'node:fs';
import path from 'node:path';

describe('sqlite kv', () => {
  it('persists values', () => {
    const p = path.join(process.cwd(), 'tmp_test_kv.db');
    if (fs.existsSync(p)) fs.unlinkSync(p);
    const kv = new SqliteKV(p);
    kv.set('a', '1');
    expect(kv.get('a')).toBe('1');
    kv.del('a');
    expect(kv.get('a')).toBeUndefined();
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });
});
