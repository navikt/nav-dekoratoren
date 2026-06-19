import html from "./html";

export const hydrateAttr = (value: string) => html`data-hydrate="${value}"`;

export const hydrateAttrObject = (value: string) => ({
    ["data-hydrate"]: value,
});

export const hydrateSelector = (value: string) => `[data-hydrate="${value}"]`;

type HydrationSelectors<Hooks extends Record<string, string>> = {
    [Key in keyof Hooks]: string;
};

export const defineHydrationHooks = <
    const Hooks extends Record<string, string>,
>(
    hooks: Hooks,
): readonly [Hooks, HydrationSelectors<Hooks>] => [
    hooks,
    Object.fromEntries(
        Object.entries(hooks).map(([key, value]) => [
            key,
            hydrateSelector(value),
        ]),
    ) as HydrationSelectors<Hooks>,
];
