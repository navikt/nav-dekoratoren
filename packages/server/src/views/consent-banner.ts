import clsx from "clsx";
import cls from "decorator-client/src/styles/consent-banner.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import { ChevronDownIcon, GlobeIcon } from "decorator-icons";
import html from "decorator-shared/html";
import { AvailableLanguage } from "decorator-shared/params";
import i18n from "../i18n";
import { Button } from "./components/button";

export type ConsentBannerProps = {
    foo: string;
};

export const ConsentBanner = ({ foo }: ConsentBannerProps) => html`
    <consent-banner>
        <dialog
            class="${cls.consentBanner}"
            aria-labelledby="consent_banner_title"
        >
            <h1 id="consent_banner_title" class="${cls.title}">
                ${i18n("consent_banner_title")}
            </h1>
            <div class="${cls.text}">${i18n("consent_banner_text")}</div>
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
        </dialog>
    </consent-banner>
`;
