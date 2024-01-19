const prefixer = require('postcss-prefix-selector');

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    require('autoprefixer'),
    // To filter out unsued tokens.
    // prefixer({
    //   transform(prefix, selector, prefixedSelector, filePath, rule) {
    //     if ([':root', ':host'].includes(selector)) {
    //       return '#header-withmenu, #footer-withmenu, main';
    //     }
    //
    //     return selector;
    //   },
    // }),

  ],
};
