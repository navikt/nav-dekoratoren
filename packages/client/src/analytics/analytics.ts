import { initAmplitude, logPageView } from "./amplitude";
import { initTaskAnalytics } from "./task-analytics/ta";
import { Auth } from "decorator-shared/auth";

export const initAnalytics = (auth: Auth) => {
    initAmplitude();
    initTaskAnalytics();

    logPageView(window.__DECORATOR_DATA__.params, auth);

    window.addEventListener("historyPush", () =>
        logPageView(window.__DECORATOR_DATA__.params, auth),
    );
};
