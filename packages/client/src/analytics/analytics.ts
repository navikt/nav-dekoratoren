import { initAmplitude, logPageView } from "./amplitude";
import { logPageView as logPageViewUmami } from "./umami";
import { initTaskAnalytics } from "./task-analytics/ta";
import { Auth } from "decorator-shared/auth";

export const initAnalytics = (auth: Auth) => {
    initAmplitude();
    initTaskAnalytics();

    logPageView(auth);
    logPageViewUmami();

    window.addEventListener("historyPush", () => logPageView(auth));
};
