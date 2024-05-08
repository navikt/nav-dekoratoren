module.exports = {
    "packages/client/*.ts?(x)": () =>
        "tsc -p ./tsconfig.json --noEmit --pretty",
};
