// Create stable classnames in dev mode to prevent HMR module imports from becoming out of sync with the classnames in the HTML
export const cssModulesScopedNameOption =
    process.env.NODE_ENV === "development"
        ? {
              generateScopedName: "[name]__[local]",
          }
        : {};
