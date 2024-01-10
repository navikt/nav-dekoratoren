import { Auth } from "./api"

export const analyticsReady = new CustomEvent('analytics-ready-event', {
    bubbles: true,
})

export type AnalyticsLoaded = CustomEvent<Auth>

export const analyticsLoaded = new CustomEvent<Auth>('analytics-loaded-event', {
    bubbles: true,
})
