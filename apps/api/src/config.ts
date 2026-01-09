import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  ZE_PORT: z.coerce.number().default(8787),
  ZE_LOG_DIR: z.string().default('./logs'),
  ZE_DB_PATH: z.string().default('./data/ze.db'),
  ZE_ADMIN_TOKEN: z.string().default('dev-admin-token'),
});

export const config = schema.parse(process.env);
