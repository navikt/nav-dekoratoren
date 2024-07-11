import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/main-menu.module.css";
import html, { Template } from "decorator-shared/html";
import { LinkGroup, MainMenuContextLink } from "decorator-shared/types";
import i18n from "../../i18n";

export type MainMenuProps = {
    title: Template;
    frontPageUrl: string;
    links: LinkGroup[];
    contextLinks: MainMenuContextLink[];
};

export function MainMenu({
    title,
    frontPageUrl,
    links,
    contextLinks,
}: MainMenuProps) {
    return html`
        <div id="decorator-main-menu" class="${cls.mainMenu}">
            <div class="${cls.content}">
                <div class="${cls.header}">
                    <h2 class="${cls.title}">${title}</h2>
                    <a href="${frontPageUrl}" class="${globalCls["navds-link"]}"
                        >${i18n("to_front_page")}</a
                    >
                </div>
                <div class="${cls.links}">
                    ${links.map(
                        ({ heading, children }) => html`
                            <div class="${cls.linkGroup}">
                                <h3 class="${cls.linkGroupHeading}">
                                    ${heading}
                                </h3>
                                <ul class="${cls.linkList}">
                                    ${children.map(
                                        ({ content, url }) => html`
                                            <li>
                                                <a
                                                    href="${url}"
                                                    class="${globalCls[
                                                        "navds-link"
                                                    ]}"
                                                    data-action="${heading}/${content}"
                                                    >${content}</a
                                                >
                                            </li>
                                        `,
                                    )}
                                </ul>
                            </div>
                        `,
                    )}
                </div>
            </div>
            ${contextLinks.length > 0 &&
            html`<div class="${cls.contextLinks}">
                ${contextLinks.map(
                    ({ content, url, description }) => html`
                        <a
                            href="${url}"
                            class="${cls.contextLink}"
                            data-action="arbeidsflate-valg"
                            data-label="${content}"
                        >
                            <div class="${cls.contextLinkTitle}">
                                ${content}
                            </div>
                            ${description &&
                            html`<div class="${cls.contextLinkDescription}">
                                ${description}
                            </div>`}
                        </a>
                    `,
                )}
            </div>`}
        </div>
    `;
}
