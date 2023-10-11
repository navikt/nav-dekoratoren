// Enable this soon
// module.exports = {
//   '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
// }

module.exports = {
    "*.{js,ts,tsx}": "eslint --cache --fix",
}
