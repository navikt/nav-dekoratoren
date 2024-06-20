import clsx from "clsx";
import cls from "decorator-client/src/styles/decorator-utils.module.css";
import utilsCls from "decorator-client/src/styles/utilities.module.css";
import html from "decorator-shared/html";
import {
    AvailableLanguage,
    Breadcrumb,
    UtilsBackground,
} from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import { Breadcrumbs } from "decorator-shared/views/breadcrumbs";
import { LanguageSelector } from "./language-selector";

export type DecoratorUtilsProps = {
    texts: Texts;
    breadcrumbs: Breadcrumb[];
    availableLanguages: AvailableLanguage[];
    utilsBackground: UtilsBackground;
};

export const DecoratorUtils = ({
    texts,
    breadcrumbs,
    availableLanguages,
    utilsBackground,
}: DecoratorUtilsProps) => {
    const label = texts.breadcrumbs;
    return html`
        <decorator-utils
            class="${clsx(cls.decoratorUtils, {
                [cls.white]: utilsBackground === "white",
                [cls.gray]: utilsBackground === "gray",
            })}"
        >
            <div
                class="${clsx(
                    cls.decoratorUtilsContent,
                    utilsCls.contentContainer,
                )}"
            >
                <breadcrumbs>
                    ${Breadcrumbs({ breadcrumbs, label })}
                </breadcrumbs>
                ${LanguageSelector({ availableLanguages, texts })}
            </div>
        </decorator-utils>
    `;
};
