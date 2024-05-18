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
    <div id="decorator-header">
        <header class="${cls.siteheader}">
            ${SkipLink(texts.skip_link)}
            <nav class="${cls.hovedmenyWrapper} ${utilsCls.contentContainer}">
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
                    })}
                </lenke-med-sporing>
                <user-menu class="${menuItemsCls.menuItems}"></user-menu>
            </nav>
        </header>
        <ops-messages class="${opsMessagesCls.opsMessages}"></ops-messages>
        ${decoratorUtils}
    </div>
`;
