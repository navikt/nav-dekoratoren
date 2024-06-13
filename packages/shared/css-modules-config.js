// Create stable classnames in dev mode for HMR
export const cssModulesScopedNameOption =
    process.env.NODE_ENV === "development"
        ? {
              generateScopedName: "[name]__[local]",
          }
        : {};
