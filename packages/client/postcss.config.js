/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-var-requires */
const prefixer = require('postcss-prefix-selector');
const customMedia = require('postcss-custom-media');
const postcssGlobalData = require('@csstools/postcss-global-data');
const literalsPlugin = require('./literals-plugin');

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    'views/**/*.ts',
    'views/*.ts',
    'server.ts',
    'params.ts',
    'public/ikoner/**/*.svg',
    'client/**/*.ts',
  ],
  css: ['client/main.css'],
  defaultExtractor: (content) => {
    return content.match(/[A-Za-z0-9_\-\[\.{1}?\]]+/g) || [];
  },
  variables: true,
});

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    postcssGlobalData({
      files: ['./src/custom-media-queries.css'],
    }),
    customMedia({}),
    require('autoprefixer'),
    prefixer({
      transform(prefix, selector, prefixedSelector, filePath, rule) {
        if ([':root', ':host'].includes(selector)) {
          return '#header-withmenu, #footer-withmenu, main';
        }

        return selector;
      },
    }),
    // purgecss,
    // literalsPlugin(),
  ],
};
