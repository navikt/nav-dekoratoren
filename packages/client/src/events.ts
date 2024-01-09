import { Auth } from "./api";

export const analyticsReadyEvent = "decorator-analytics-ready";

export const analyticsReady = (response: Auth) => new CustomEvent(analyticsReadyEvent, {
    bubbles: true,
    detail: response
})
