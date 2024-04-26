import html from "decorator-shared/html";

import cls from "decorator-client/src/styles/splash-page.module.css";
import { match } from "ts-pattern";

function SplashPage() {
    return html`
        <div class="${cls.splashPage}">
            <div class="${cls.splashAlert}">
                <span
                    >Hei! Dette er en intern test-side for header og footer på
                    nav.no. <a href="https://www.nav.no">Gå til forsiden</a>.
                </span>
            </div>
        </div>
    `;
}

const domainsToShow = ["localhost", "decorator-next"] as const;

export const getSplashPage = (origin: string) =>
    match(origin)
        .when(
            (origin) => domainsToShow.some((domain) => origin.includes(domain)),
            SplashPage,
        )
        .otherwise(() => undefined);
