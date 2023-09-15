import { serverSchema, serverEnv } from './schema';

const _serverEnv = serverSchema.safeParse(serverEnv);

if (!_serverEnv.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    _serverEnv.error.format(),
  );
  throw new Error('Invalid environment variables');
}

export const env = { ..._serverEnv.data };
