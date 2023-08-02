const prefixer = require("postcss-prefix-selector");

const purgecss = require("@fullhuman/postcss-purgecss")({
  content: [
    "views/**/*.ts",
    "views/*.ts",
    "server.ts",
    "params.ts",
    "public/ikoner/**/*.svg",
    "client/**/*.ts",
  ],
  css: ["client/main.css"],
  defaultExtractor: (content) => {
    // Added ":" to regex to match tailwind modifiers
    return content.match(/[A-Za-z0-9_:\-\[\]]+/g) || [];
  },
  variables: true,
});

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    prefixer({
      transform(prefix, selector, prefixedSelector, filePath, rule) {
        if ([":root", ":host"].includes(selector)) {
          return "#header-withmenu, #footer-withmenu";
        }

        return selector;
      },
    }),
    purgecss,
  ],
};
