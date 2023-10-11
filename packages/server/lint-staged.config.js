export default {
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit --pretty',
};
