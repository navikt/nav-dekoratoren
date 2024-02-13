export default {
    'packages/server/**/*.ts?(x)': () => 'tsc -p ./tsconfig.json --noEmit --pretty',
};
