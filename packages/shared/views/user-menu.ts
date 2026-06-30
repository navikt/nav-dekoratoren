import { defineHydrationHooks } from "../hydration";

export const [userMenuHook, userMenuSelector] = defineHydrationHooks({
    loader: "user.loader",
});
