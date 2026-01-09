export type GateResult = { name: string; pass: boolean; details?: string };

export function requireTrue(name: string, cond: boolean, details?: string): GateResult {
  return { name, pass: cond, details: cond ? undefined : details ?? 'failed' };
}

export function summarize(gates: GateResult[]) {
  const pass = gates.every(g => g.pass);
  return { pass, gates };
}
