import { initAmplitude, logPageView } from "./amplitude";
import { initTaskAnalytics } from "./task-analytics/ta";
import { Auth } from "decorator-shared/auth";

export const initAnalytics = (auth: Auth) => {
    initAmplitude();
    initTaskAnalytics();

    logPageView(window.__DECORATOR_DATA__.params, auth);

    window.addEventListener("historyPush", () =>
        // TODO: can this be solved in a more dependable manner?
        // setTimeout to ensure window.location is updated after the history push
        setTimeout(
            () => logPageView(window.__DECORATOR_DATA__.params, auth),
            250,
        ),
    );
};
