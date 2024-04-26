import clsx from "clsx";
import cls from "decorator-client/src/styles/header.module.css";
import menuCls from "decorator-client/src/styles/complex-header-menu.module.css";
import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";
import opsMessagesCls from "decorator-client/src/styles/ops-messages.module.css";
import utilsCls from "decorator-client/src/styles/utilities.module.css";
import { ContextLink } from "decorator-shared/context";
import html, { Template } from "decorator-shared/html";
import { Context, Language } from "decorator-shared/params";
import { Texts } from "decorator-shared/types";
import { BurgerIcon, SearchIcon } from "decorator-shared/views/icons";
import { SkipLink } from "decorator-shared/views/skiplink";
import { NavLogo } from "decorator-shared/views/nav-logo";
import { DropdownMenu } from "../dropdown-menu";
import { IconButton } from "../icon-button";
import { SearchForm } from "../search-form";
import { LoginButton } from "../login-button";

export type ComplexHeaderProps = {
    texts: Texts;
    context: Context;
    language: Language;
    contextLinks: ContextLink[];
    decoratorUtils: Template;
};

export function ComplexHeader({
    language,
    contextLinks,
    texts,
    context: currentContext,
    decoratorUtils,
}: ComplexHeaderProps) {
    // @TODO: Need id here for css vars.
    return html`
        <div id="decorator-header">
            <header class="${cls.siteheader}">
                ${SkipLink(texts.skip_link)}
                <nav
                    class="${cls.hovedmenyWrapper} ${utilsCls.contentContainer}"
                >
                    <div class="${cls.hovedmenyContent}">
                        <lenke-med-sporing
                            href="/"
                            class="${cls.logo}"
                            data-analytics
                            event
                            args="${JSON.stringify({
                                category: "dekorator-header",
                                action: "navlogo",
                            })}"
                        >
                            ${NavLogo({
                                title: texts.to_front_page,
                                id: "dekoratoren-header-logo",
                            })}
                        </lenke-med-sporing>
                        <div class="${cls.arbeidsflate}">
                            ${(language === "nb" || language === "nn") &&
                            contextLinks?.map(
                                ({ url, lenkeTekstId, context }) =>
                                    html` <context-link
                                        href="${url}"
                                        data-analytics-event-args="${JSON.stringify(
                                            {
                                                action: "arbeidsflate-valg",
                                                category: "dekorator-header",
                                                label: context,
                                            },
                                        )}"
                                        class="${clsx(cls.headerContextLink, {
                                            [cls.lenkeActive]:
                                                context === currentContext,
                                        })}"
                                        data-context="${context.toLowerCase()}"
                                    >
                                        ${texts[lenkeTekstId]}
                                    </context-link>`,
                            )}
                        </div>
                    </div>
                    <div class="${menuItemsCls.menuItems}">
                        <user-menu>
                            ${LoginButton({
                                texts: texts,
                            })}
                        </user-menu>
                        <div class="${menuItemsCls.menuItemsUniversalLinks}">
                            ${language !== "se" &&
                            DropdownMenu({
                                button: IconButton({
                                    Icon: BurgerIcon(),
                                    text: texts.menu,
                                }),
                                dropdownContent: html`
                                    <search-menu class="${menuCls.searchMenu}">
                                        ${SearchForm({ texts })}</search-menu
                                    >
                                    <main-menu></main-menu>
                                `,
                            })}
                            ${DropdownMenu({
                                button: IconButton({
                                    Icon: SearchIcon({
                                        menuSearch: true,
                                    }),
                                    text: texts.search,
                                    className: menuItemsCls.searchButton,
                                }),
                                dropdownClass: menuItemsCls.searchDropdown,
                                dropdownContent: html`
                                    <search-menu
                                        class="${menuItemsCls.searchMenu}"
                                        data-auto-focus
                                    >
                                        ${SearchForm({ texts })}
                                    </search-menu>
                                `,
                            })}
                        </div>
                    </div>
                </nav>
            </header>
            <ops-messages class="${opsMessagesCls.opsMessages}"></ops-messages>
            ${decoratorUtils}
            <menu-background></menu-background>
        </div>
    `;
}
