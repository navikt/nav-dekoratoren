import clsx from "clsx";
import menuCls from "decorator-client/src/styles/complex-header-menu.module.css";
import cls from "decorator-client/src/styles/header.module.css";
import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";
import opsMessagesCls from "decorator-client/src/styles/ops-messages.module.css";
import utilsCls from "decorator-client/src/styles/utilities.module.css";
import html, { Template } from "decorator-shared/html";
import { Context, Language } from "decorator-shared/params";
import { BurgerIcon, SearchIcon } from "decorator-shared/views/icons";
import { NavLogo } from "decorator-shared/views/nav-logo";
import { ContextLink } from "../../context";
import i18n from "../../i18n";
import { DropdownMenu } from "../dropdown-menu";
import { HeaderButton } from "../header-button";
import { SearchForm } from "../search-form";
import { SkipLink } from "../skip-link";
import { Sticky } from "../sticky";
import { UserMenu } from "../user-menu";

export type ComplexHeaderProps = {
    frontPageUrl: string;
    context: Context;
    language: Language;
    contextLinks: ContextLink[];
    decoratorUtils: Template;
    loginUrl: string;
};

export function ComplexHeader({
    frontPageUrl,
    language,
    contextLinks,
    context: currentContext,
    decoratorUtils,
    loginUrl,
}: ComplexHeaderProps) {
    // @TODO: Need id here for css vars.
    return html`
        <header id="decorator-header">
            <div class="${cls.siteheader}">
                ${SkipLink(i18n("skip_link"))}
                ${Sticky({
                    children: html`
                        <nav
                            aria-label="${i18n("menu")}"
                            class="${cls.hovedmenyWrapper} ${utilsCls.contentContainer}"
                        >
                            <div class="${cls.hovedmenyContent}">
                                <lenke-med-sporing
                                    href="${frontPageUrl}"
                                    class="${cls.logo}"
                                    data-analytics
                                    event
                                    args="${JSON.stringify({
                                        category: "dekorator-header",
                                        action: "navlogo",
                                    })}"
                                >
                                    ${NavLogo({
                                        title: i18n("to_front_page"),
                                        titleId: "logo-svg-title",
                                    })}
                                </lenke-med-sporing>
                                ${contextLinks.length > 0 &&
                                html`<div class="${cls.arbeidsflate}">
                                    ${contextLinks.map(
                                        ({ url, lenkeTekstId, context }) =>
                                            html` <context-link
                                                href="${url}"
                                                data-analytics-event-args="${JSON.stringify(
                                                    {
                                                        action: "arbeidsflate-valg",
                                                        category:
                                                            "dekorator-header",
                                                        label: context,
                                                    },
                                                )}"
                                                class="${clsx(
                                                    cls.headerContextLink,
                                                    {
                                                        [cls.lenkeActive]:
                                                            context ===
                                                            currentContext,
                                                    },
                                                )}"
                                                data-context="${context.toLowerCase()}"
                                            >
                                                ${i18n(lenkeTekstId)}
                                            </context-link>`,
                                    )}
                                    Nyere versjon
                                </div>`}
                            </div>
                            <div class="${menuItemsCls.menuItems}">
                                ${UserMenu({ loginUrl })}
                                <div
                                    class="${menuItemsCls.menuItemsUniversalLinks}"
                                >
                                    ${language !== "se" &&
                                    DropdownMenu({
                                        button: HeaderButton({
                                            content: i18n("menu"),
                                            icon: BurgerIcon(),
                                        }),
                                        dropdownContent: html`
                                            <search-menu
                                                class="${menuCls.searchMenu}"
                                            >
                                                ${SearchForm()}
                                            </search-menu>
                                            <main-menu></main-menu>
                                        `,
                                    })}
                                    ${DropdownMenu({
                                        button: HeaderButton({
                                            content: i18n("search"),
                                            icon: SearchIcon({
                                                menuSearch: true,
                                            }),
                                            className:
                                                menuItemsCls.searchButton,
                                        }),
                                        dropdownClass:
                                            menuItemsCls.searchDropdown,
                                        dropdownContent: html`
                                            <search-menu
                                                class="${menuItemsCls.searchMenu}"
                                                data-auto-focus
                                            >
                                                ${SearchForm()}
                                            </search-menu>
                                        `,
                                    })}
                                </div>
                            </div>
                        </nav>
                    `,
                })}
            </div>
            <ops-messages class="${opsMessagesCls.opsMessages}"></ops-messages>
            ${decoratorUtils}
            <menu-background></menu-background>
        </header>
    `;
}
