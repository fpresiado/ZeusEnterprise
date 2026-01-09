export interface KVStore {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  del(key: string): void;
  keys(prefix?: string): string[];
}
