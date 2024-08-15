module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    ignorePatterns: ["**/*.js"],
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "warn",
    },
};
