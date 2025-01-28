import cls from "decorator-client/src/styles/consent-banner.module.css";
import { InformationSquareFillIcon, ExpandIcon } from "decorator-icons";

import html from "decorator-shared/html";
import i18n from "../i18n";
import { Button } from "./components/button";

export const ConsentBanner = () => html`
    <consent-banner>
        <div
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
                <div class="${cls.column}">
                    ${InformationSquareFillIcon({ className: cls.infoIcon })}
                </div>
                <div class="${cls.column}">
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
                        <a href="/informasjonskapsler" class="${cls.aboutLink}">
                            ${i18n("consent_banner_about_cookies")}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </consent-banner>
`;
