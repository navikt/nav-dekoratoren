const prefixer = require("postcss-prefix-selector");

/** @type {import('postcss-load-config').Config} */
module.exports = {
    plugins: [require("autoprefixer")],
};
