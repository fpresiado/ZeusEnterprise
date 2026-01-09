import type { PluginManifest } from '@ze/shared';

export type LoadedPlugin = {
  manifest: PluginManifest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any;
};

export class PluginRegistry {
  private plugins = new Map<string, LoadedPlugin>();

  load(manifest: PluginManifest, mod: unknown) {
    if (this.plugins.has(manifest.id)) throw new Error(`Plugin already loaded: ${manifest.id}`);
    this.plugins.set(manifest.id, { manifest, module: mod });
  }

  list() {
    return [...this.plugins.values()].map(p => p.manifest);
  }

  get(id: string) {
    const p = this.plugins.get(id);
    if (!p) throw new Error(`Plugin not found: ${id}`);
    return p;
  }
}
