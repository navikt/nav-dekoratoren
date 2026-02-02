import nextConfig from "eslint-config-next";

const config = [
    {
        ignores: ["**/node_modules/**", ".next/**", "out/**"],
    },
    ...nextConfig,
];

export default config;
