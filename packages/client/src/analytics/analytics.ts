import { initAmplitude, logPageView, stopAmplitude } from "./amplitude";
import { initTaskAnalytics, stopTaskAnalytics } from "./task-analytics/ta";
import { Auth } from "decorator-shared/auth";

const logPageViewCallback = (auth: Auth) => () => logPageView(auth);

export const initAnalytics = (auth: Auth) => {
    initAmplitude();
    initTaskAnalytics();

    logPageView(auth);

    // Pass the callback as a function reference
    window.addEventListener("historyPush", logPageViewCallback(auth));
};

export const stopAnalytics = (auth: Auth) => {
    stopAmplitude();
    stopTaskAnalytics();

    // Pass the same function reference
    window.removeEventListener("historyPush", logPageViewCallback(auth));
};
