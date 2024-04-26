import { analyticsReady } from "../events";
import { initAmplitude } from "./amplitude";
import { initTaskAnalytics } from "./task-analytics/ta";

export const initAnalytics = () => {
    initAmplitude();
    initTaskAnalytics();
    dispatchEvent(analyticsReady);
};
