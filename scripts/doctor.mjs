import fs from 'node:fs';
import path from 'node:path';

const REQUIRED = [
  'package.json',
  'pnpm-workspace.yaml',
  'autonomy_policy.json',
  'prompts/system.md',
  'docs/BLUEPRINT.md',
  'docs/RunPod.md',
  'apps/api/package.json',
  'apps/web/package.json',
  'packages/core/package.json',
  'packages/shared/package.json',
  'packages/tools/package.json',
];

const errors: string[] = [];

for (const f of REQUIRED) {
  if (!fs.existsSync(path.resolve(f))) errors.push(`Missing required file: ${f}`);
}

function scanForEllipsis(dir: string) {
  const exts = new Set(['.ts', '.tsx', '.js', '.mjs', '.md', '.json', '.yml', '.yaml']);
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop()!;
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name === 'dist') continue;
        stack.push(p);
      } else if (exts.has(path.extname(ent.name))) {
        const t = fs.readFileSync(p, 'utf8');
        if (t.includes('...')) {
          // allow markdown ellipsis, disallow code placeholders
          if (path.extname(ent.name) !== '.md') {
            errors.push(`Potential placeholder "..." found in ${p}`);
          }
        }
      }
    }
  }
}

scanForEllipsis(process.cwd());

if (errors.length) {
  console.error('ZE doctor FAILED:\n' + errors.map(e => `- ${e}`).join('\n'));
  process.exit(1);
}

console.log('ZE doctor OK');
