import fs from 'node:fs';
import path from 'node:path';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

export type LoggerOpts = {
  /** Optional service label included in each line */
  service?: string;
  /** Log folder. Defaults to /workspace/logs if present, otherwise ./logs */
  logDir?: string;
  /** Legacy file name (matches your preference) */
  legacyFile?: string;
};

function defaultLogDir() {
  // Prefer the canonical Windows path when mounted; otherwise fall back.
  const win = 'C:\\Log files\\USB admin log files';
  if (fs.existsSync(win)) return win;
  const wp = '/workspace/logs';
  if (fs.existsSync('/workspace')) return wp;
  return path.resolve(process.cwd(), 'logs');
}

export function createLogger(opts: LoggerOpts = {}) {
  const logDir = opts.logDir ?? defaultLogDir();
  const legacyFile = opts.legacyFile ?? 'usb log file.txt';
  fs.mkdirSync(logDir, { recursive: true });

  const legacy = path.join(logDir, legacyFile);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const run = path.join(logDir, `run_${ts}.log`);

  function write(level: LogLevel, event: string, data?: Record<string, unknown>) {
    const base = { ts: new Date().toISOString(), level, service: opts.service ?? 'ze', event, ...(data ? { data } : {}) };
    const line = JSON.stringify(base) + '\n';
    fs.appendFileSync(legacy, line);
    fs.appendFileSync(run, line);
  }

  return {
    legacyPath: legacy,
    runPath: run,
    info: (event: string, data?: Record<string, unknown>) => write('INFO', event, data),
    warn: (event: string, data?: Record<string, unknown>) => write('WARN', event, data),
    error: (event: string, data?: Record<string, unknown>) => write('ERROR', event, data),
    success: (event: string, data?: Record<string, unknown>) => write('SUCCESS', event, data),
  };
}
