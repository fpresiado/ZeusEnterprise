import Database from 'better-sqlite3';
import type { KVStore } from './kv.js';

export class SqliteKV implements KVStore {
  private db: Database.Database;
  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv (
        k TEXT PRIMARY KEY,
        v TEXT NOT NULL
      );
    `);
  }

  get(key: string) {
    const row = this.db.prepare('SELECT v FROM kv WHERE k=?').get(key) as { v: string } | undefined;
    return row?.v;
  }

  set(key: string, value: string) {
    this.db.prepare('INSERT INTO kv(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').run(key, value);
  }

  del(key: string) {
    this.db.prepare('DELETE FROM kv WHERE k=?').run(key);
  }

  keys(prefix = '') {
    const rows = this.db.prepare('SELECT k FROM kv WHERE k LIKE ? ORDER BY k').all(`${prefix}%`) as { k: string }[];
    return rows.map(r => r.k);
  }
}
