/**
 * Config for typescript-plugin-css-modules.
 * It doesn't support async, so we need to use postcss-import-sync2.
 */
module.exports = { plugins: { "postcss-import-sync2": {} } };
