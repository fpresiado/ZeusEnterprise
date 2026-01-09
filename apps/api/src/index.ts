import Fastify from 'fastify';
import { z } from 'zod';
import { createLogger } from '@ze/tools';

const log = createLogger({ service: 'api' });
const app = Fastify({ logger: false });

app.get('/health', async () => ({ ok: true, ts: new Date().toISOString() }));

app.get('/version', async () => ({
  name: 'ZEusEnterprise',
  version: process.env.npm_package_version ?? '0.0.0',
}));

// Minimal task submit endpoint (placeholder for future worker integration)
const TaskReq = z.object({
  name: z.string().min(1),
  input: z.record(z.any()).default({}),
});

app.post('/tasks', async (req, reply) => {
  const parsed = TaskReq.safeParse(req.body);
  if (!parsed.success) return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
  log.info('task_received', { name: parsed.data.name });
  return { ok: true, accepted: true, task: { id: crypto.randomUUID(), ...parsed.data } };
});

const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? '0.0.0.0';

app.listen({ port, host }).then(() => {
  log.info('listening', { host, port });
}).catch((err) => {
  log.error('startup_failed', { err: String(err) });
  process.exit(1);
});
