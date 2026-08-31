import cls from "decorator-client/src/styles/consent-banner.module.css";
import utilsCls from "decorator-client/src/styles/utils.module.css";

import html from "decorator-shared/html";
import i18n from "../i18n";
import { Button } from "./components/button";
import { Language } from "decorator-shared/params";
import {
    CONSENT_COOKIE_NAME,
    CURRENT_CONSENT_VERSION,
} from "decorator-shared/constants";

type ConsentBannerProps = {
    language: Language;
};

export const ConsentBanner = ({ language }: ConsentBannerProps) => {
    const languageSuffix = language === "en" ? `/${language}` : "";
    const moreUrl = `/informasjonskapsler${languageSuffix}`;

    return html`
        <consent-banner>
            ${consentDetectionScript()}
            <div class="${cls.background}">
                <div class="${utilsCls.contentContainer}">
                    <section
                        class="${cls.consentBanner}"
                        aria-labelledby="consent_banner_title"
                        id="consent-banner-dialog"
                    >
                        <div class="${cls.content}">
                            <h2
                                id="consent_banner_title"
                                class="${cls.title}"
                                tabindex="-1"
                            >
                                ${i18n("consent_banner_title")}
                            </h2>
                            <p class="${cls.text}">
                                ${i18n("consent_banner_text", { url: moreUrl })}
                            </p>
                            <div class="${cls.buttonContainer}">
                                ${consentButtons()}
                            </div>
                            <p class="${cls.text}">
                                ${i18n("consent_banner_additional_cookies_info")}${" "}
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </consent-banner>
    `;
};

// Runs before first paint, as the first child of <consent-banner> to avoid CLS.
// Note the functionality here is duplicated in webStorage (yes this is icky).
function consentDetectionScript() {
    return html`
        <script>
            try {
                const root = document.documentElement;
                if (!root.dataset.decoratorConsent) {
                    let decided = false;
                    try {
                        const match = document.cookie.match(
                            /(?:^|; ?)${CONSENT_COOKIE_NAME}=([^;]*)/,
                        );
                        const consent =
                            match && JSON.parse(decodeURIComponent(match[1]));
                        decided = !!(
                            consent?.userActionTaken &&
                            consent.meta?.version >= ${CURRENT_CONSENT_VERSION}
                        );
                    } catch {}
                    root.dataset.decoratorConsent = decided
                        ? "decided"
                        : "pending";
                }
            } catch {}
        </script>
    `;
}

function consentButtons() {
    return html`
        ${Button({
            content: i18n("consent_banner_consent_all"),
            variant: "primary",
            attributes: {
                ["data-name"]: "consent-banner-all",
                // data-testid brukes av Playwright i andre team for styring av cookiebanner
                // den må ikke endres uten at de andre teamene er informert
                ["data-testid"]: "consent-banner-all",
            },
            className: cls.button,
        })}
        ${Button({
            content: i18n("consent_banner_refuse_optional"),
            variant: "primary",
            attributes: {
                ["data-name"]: "consent-banner-refuse-optional",
                ["data-testid"]: "consent-banner-refuse-optional",
            },
            className: cls.button,
        })}
    `;
}
