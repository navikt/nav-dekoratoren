import { defineConfig } from 'oxfmt';

export default defineConfig({
	useTabs: true,
	tabWidth: 2,
	printWidth: 120,
	trailingComma: 'es5',
	semi: true,
	singleQuote: true,
	endOfLine: 'lf',
	ignorePatterns: ['.nais/**'],
});
