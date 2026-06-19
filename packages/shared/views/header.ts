import { defineHydrationHooks } from "../hydration";

export const [headerHook, headerSelector] = defineHydrationHooks({
    content: "header.content",
});
