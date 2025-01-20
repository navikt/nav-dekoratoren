import { initAmplitude, logPageView } from "./amplitude";
import { initTaskAnalytics } from "./task-analytics/ta";
import { Auth } from "decorator-shared/auth";

export const initAnalytics = (auth: Auth) => {
    initAmplitude();
    initTaskAnalytics();

    logPageView(auth);

    window.addEventListener("historyPush", () => logPageView(auth));
};
