const purgecss = require("@fullhuman/postcss-purgecss")({
  content: [
    "views/**/*.mustache",
    "server.ts",
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
    // purge twice because it has trouble with ":root, :host" from @navikt/ds-tokens
    purgecss,
    purgecss,
  ],
};
