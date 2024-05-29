import cls from "decorator-client/src/styles/header.module.css";
import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";
import opsMessagesCls from "decorator-client/src/styles/ops-messages.module.css";
import utilsCls from "decorator-client/src/styles/utilities.module.css";
import html, { Template } from "decorator-shared/html";
import { Texts } from "decorator-shared/types";
import { SkipLink } from "decorator-shared/views/skip-link";
import { NavLogo } from "decorator-shared/views/nav-logo";

export type SimpleHeaderProps = {
    texts: Texts;
    decoratorUtils: Template;
};

export const SimpleHeader = ({
    texts,
    decoratorUtils,
}: SimpleHeaderProps) => html`
    <header id="decorator-header">
        <div class="${cls.siteheader}">
            ${SkipLink(texts.skip_link)}
            <div class="${cls.hovedmenyWrapper} ${utilsCls.contentContainer}">
                <lenke-med-sporing
                    href="/"
                    class="${cls.logo} ${cls.logoSimple}"
                    data-analytics-event-args="${JSON.stringify({
                        category: "dekorator-header",
                        action: "navlogo",
                    })}"
                >
                    ${NavLogo({
                        title: texts.to_front_page,
                        titleId: "logo-svg-title",
                    })}
                </lenke-med-sporing>
                <user-menu class="${menuItemsCls.menuItems}"></user-menu>
            </div>
        </div>
        <ops-messages class="${opsMessagesCls.opsMessages}"></ops-messages>
        ${decoratorUtils}
    </header>
`;
