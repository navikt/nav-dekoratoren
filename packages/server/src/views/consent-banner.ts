import cls from "decorator-client/src/styles/consent-banner.module.css";
import { ExpandIcon } from "decorator-icons";

import html from "decorator-shared/html";
import i18n from "../i18n";
import { Button } from "./components/button";
import { Language } from "decorator-shared/params";

type ConsentBannerProps = {
    language: Language;
};

export const ConsentBanner = ({ language }: ConsentBannerProps) => {
    const languageSuffix = language === "nb" ? "" : `/${language}`;
    const moreUrl = `https://www.nav.no/informasjonskapsler${languageSuffix}`;

    return html`
        <consent-banner>
            <section
                class="${cls.consentBanner}"
                aria-labelledby="consent_banner_title"
                id="consent-banner-dialog"
            >
                <div class="${cls.miniContent}">
                    ${Button({
                        content: html`<span
                                >${i18n("consent_banner_minimized")}</span
                            >${ExpandIcon({
                                className: cls.expandIcon,
                            })}`,
                        attributes: {
                            ["data-name"]: "consent-banner-expand",
                        },
                        className: cls.expandButton,
                    })}
                </div>
                <div class="${cls.content}">
                    <h2
                        id="consent_banner_title"
                        class="${cls.title}"
                        tabindex="-1"
                    >
                        ${i18n("consent_banner_title")}
                    </h2>
                    <p class="${cls.text}">${i18n("consent_banner_text")}</p>
                    <div class="${cls.buttonContainer}">
                        ${Button({
                            content: i18n("consent_banner_consent_all"),
                            variant: "primary",
                            attributes: { ["data-name"]: "consent-banner-all" },
                            className: cls.button,
                        })}
                        ${Button({
                            content: i18n("consent_banner_refuse_optional"),
                            variant: "primary",
                            attributes: {
                                ["data-name"]: "consent-banner-refuse-optional",
                            },
                            className: cls.button,
                        })}
                    </div>
                    <p class="${cls.text}">
                        ${i18n("consent_banner_change_consent")}
                    </p>
                    <p class="${cls.text}">
                        ${i18n("consent_banner_additional_cookies_info")}${" "}
                        <a href="${moreUrl}" class="${cls.moreLink}">
                            ${i18n("consent_banner_additional_cookies_link")}
                        </a>
                    </p>
                </div>
            </section>
        </consent-banner>
    `;
};
