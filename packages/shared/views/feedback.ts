import { defineHydrationHooks } from "../hydration";

export const [feedbackHook, feedbackSelector] = defineHydrationHooks({
    content: "feedback.content",
    success: "feedback.success",
});
