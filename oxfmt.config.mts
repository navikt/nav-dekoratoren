import { defineConfig } from 'oxfmt';

export default defineConfig({
	useTabs: true,
	printWidth: 120,
	trailingComma: 'es5',
	semi: true,
	singleQuote: true,
	endOfLine: 'lf',
	ignorePatterns: ['.nais/**'],
});
