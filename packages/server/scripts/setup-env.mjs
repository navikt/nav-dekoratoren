import { copyFileSync, existsSync } from 'node:fs';
import { URL } from 'node:url';

const envFile = new URL('../.env', import.meta.url);
const overwrite = process.argv.includes('--overwrite');

if (overwrite || !existsSync(envFile)) {
	copyFileSync(new URL('../.env.sample', import.meta.url), envFile);
}
