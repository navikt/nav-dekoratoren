import html from "decorator-shared/html";
import { match } from "ts-pattern";

import cls from "decorator-client/src/styles/splash-page.module.css";

function SplashPage() {
    return html`
        <div class="${cls.splashPage}">
            <h1>Nav Dekoratøren</h1>
            <div class="${cls.splashAlert}">
                <span>
                    Dette er en intern test-side for header og footer på nav.no.
                    <a href="https://www.nav.no">Gå til forsiden</a>.
                </span>
            </div>
        </div>
    `;
}

const allowedHosts = ["localhost", "nav.no"] as const;

export const getSplashPage = (urlOrigin: string) =>
    match(urlOrigin)
        .when(
            (urlOrigin) =>
                allowedHosts.some((host) => urlOrigin.includes(host)),
            SplashPage,
        )
        .otherwise(() => undefined);
