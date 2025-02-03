import { initAmplitude, logPageView, stopAmplitude } from "./amplitude";
import {
    initTaskAnalyticsScript,
    stopTaskAnalytics,
} from "./task-analytics/ta";
import { Auth } from "decorator-shared/auth";

const logPageViewCallback = (auth: Auth) => () => logPageView(auth);

export const mockAmplitude = () =>
    new Promise<any>((resolve, reject) => {
        reject(
            "Amplitude is not initialized. Please check for user analytics consent",
        );
    });

export const initAnalytics = (auth: Auth) => {
    initAmplitude();
    initTaskAnalyticsScript();

    logPageView(auth);

    // Pass the callback as a function reference
    window.addEventListener("historyPush", logPageViewCallback(auth));
};

export const stopAnalytics = (auth: Auth) => {
    stopAmplitude();
    stopTaskAnalytics();

    window.dekoratorenAmplitude = mockAmplitude;

    // Pass the same function reference
    window.removeEventListener("historyPush", logPageViewCallback(auth));
};
