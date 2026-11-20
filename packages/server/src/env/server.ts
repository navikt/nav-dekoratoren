import { clientEnvSchema } from 'decorator-shared/params';
import { serverSchema, serverEnv, client_env } from './schema';
import { logger } from '../lib/logger';

const _serverEnv = serverSchema.safeParse(serverEnv);
const _clientEnv = clientEnvSchema.safeParse(client_env);

if (!_serverEnv.success) {
	logger.error('❌ Invalid server environment variables', {
		paths: _serverEnv.error.issues.map((issue) => issue.path.join('.')),
	});
	throw new Error('Invalid server environment variables');
}

if (!_clientEnv.success) {
	logger.error('❌ Invalid client environment variables', {
		paths: _clientEnv.error.issues.map((issue) => issue.path.join('.')),
	});
	throw new Error('Invalid client environment variables');
}

export const env = _serverEnv.data;
export const clientEnv = {
	..._clientEnv.data,
};
