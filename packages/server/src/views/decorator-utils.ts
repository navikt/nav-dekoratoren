import clsx from "clsx";
import cls from "decorator-client/src/styles/decorator-utils.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import html from "decorator-shared/html";
import {
    AvailableLanguage,
    Breadcrumb,
    Language,
    UtilsBackground,
} from "decorator-shared/params";
import { Breadcrumbs } from "decorator-shared/views/breadcrumbs";
import i18n from "../i18n";
import { LanguageSelector } from "./language-selector";

export type DecoratorUtilsProps = {
    breadcrumbs: Breadcrumb[];
    availableLanguages: AvailableLanguage[];
    language: Language;
    utilsBackground: UtilsBackground;
    frontPageUrl: string;
};

export const DecoratorUtils = ({
    breadcrumbs,
    availableLanguages,
    language,
    utilsBackground,
    frontPageUrl,
}: DecoratorUtilsProps) => {
    return html`
        <decorator-utils
            class="${clsx(cls.decoratorUtils, {
                [utils.hidden]:
                    availableLanguages.length === 0 && breadcrumbs.length === 0,
                [cls.white]: utilsBackground === "white",
                [cls.gray]: utilsBackground === "gray",
            })}"
        >
            <div
                class="${clsx(
                    cls.decoratorUtilsContent,
                    utils.contentContainer,
                )}"
            >
                <d-breadcrumbs
                    >${Breadcrumbs({
                        breadcrumbs,
                        label: i18n("breadcrumbs"),
                        frontPageUrl,
                    })}</d-breadcrumbs
                >
                ${LanguageSelector({ availableLanguages, language })}
            </div>
        </decorator-utils>
    `;
};
