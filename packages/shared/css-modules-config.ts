// Create stable classnames in dev mode, in order to not break in HMR when loaded via other apps
export const cssModulesScopedNameOption =
    process.env.NODE_ENV === "development"
        ? {
              generateScopedName: "[name]__[local]",
          }
        : {};
