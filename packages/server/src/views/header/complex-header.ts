import clsx from "clsx";
import menuCls from "decorator-client/src/styles/complex-header-menu.module.css";
import cls from "decorator-client/src/styles/header.module.css";
import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";
import opsMessagesCls from "decorator-client/src/styles/ops-messages.module.css";
import utilsCls from "decorator-client/src/styles/utils.module.css";
import { BurgerIcon, SearchIcon } from "decorator-icons";
import html, { Template } from "decorator-shared/html";
import { Context, Language } from "decorator-shared/params";
import { headerHook } from "decorator-shared/views/header";
import { hydrateAttr } from "decorator-shared/hydration";
import { NavLogo } from "decorator-shared/views/nav-logo";
import { ContextLink } from "../../context";
import i18n from "../../i18n";
import { HeaderButton } from "../components/header-button";
import { DropdownMenu } from "../dropdown-menu";
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
    mainMenu: Template | null;
};

export function ComplexHeader({
    frontPageUrl,
    language,
    contextLinks,
    context: currentContext,
    decoratorUtils,
    loginUrl,
    mainMenu,
}: ComplexHeaderProps) {
    return html`
        <div
            class="${cls.siteheader}"
            ${hydrateAttr(headerHook.content)}
            id="toppen"
            data-color="neutral"
        >
            ${SkipLink(i18n("skip_link"))}
            ${Sticky({
                children: html`
                    <nav
                        aria-label="${i18n("menu")}"
                        class="${cls.hovedmenyWrapper} ${utilsCls.contentContainer}"
                    >
                        <div class="${cls.hovedmenyContent}">
                            <a href="${frontPageUrl}" class="${cls.logo}">
                                ${NavLogo({
                                    title: i18n("to_front_page"),
                                    titleId: "logo-svg-title",
                                })}
                            </a>
                            ${contextLinks.length > 0 &&
                            html`
                                <context-links class="${cls.arbeidsflate}">
                                    ${contextLinks.map(
                                        ({ url, context }) => html`
                                            <a
                                                href="${url}"
                                                class="${clsx(
                                                    cls.headerContextLink,
                                                    context ===
                                                        currentContext &&
                                                        cls.lenkeActive,
                                                )}"
                                                data-kategori="dekorator-header"
                                                data-context="${context}"
                                            >
                                                ${i18n(context)}
                                            </a>
                                        `,
                                    )}
                                </context-links>
                            `}
                        </div>
                        <div
                            class="${menuItemsCls.menuItems}"
                            data-color="accent"
                        >
                            ${UserMenu({ loginUrl })}
                            <div
                                class="${menuItemsCls.menuItemsUniversalLinks}"
                            >
                                ${language !== "se" &&
                                DropdownMenu({
                                    button: (attributes) =>
                                        HeaderButton({
                                            content: i18n("menu"),
                                            icon: BurgerIcon(),
                                            attributes,
                                        }),
                                    dropdownContent: html`
                                        <search-menu
                                            class="${menuCls.searchMenu}"
                                        >
                                            ${SearchForm()}
                                        </search-menu>
                                        <main-menu>${mainMenu}</main-menu>
                                    `,
                                    attributes: {
                                        ["menu-type"]: "menu",
                                    },
                                })}
                                ${DropdownMenu({
                                    button: (attributes) =>
                                        HeaderButton({
                                            content: i18n("search"),
                                            icon: SearchIcon(),
                                            className:
                                                menuItemsCls.searchButton,
                                            attributes,
                                        }),
                                    dropdownClass: menuItemsCls.searchDropdown,
                                    dropdownContent: html`
                                        <search-menu
                                            class="${menuItemsCls.searchMenu}"
                                            data-auto-focus
                                        >
                                            ${SearchForm()}
                                        </search-menu>
                                    `,
                                    attributes: {
                                        ["menu-type"]: "search",
                                    },
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
    `;
}
