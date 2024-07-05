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
    return html`<div id="decorator-main-menu" class="${cls.mainMenu}">
        <div class="${cls.content}">
            <div class="${cls.header}">
                <h2 class="${cls.titleNew5}">
                    ${title} enda ENDA nyere versjon
                </h2>
                <lenke-med-sporing
                    href="${frontPageUrl}"
                    class="${globalCls["navds-link"]}"
                    data-analytics-event-args="${JSON.stringify({
                        category: "dekorator-meny",
                        action: "hovedmeny/forsidelenke",
                        label: frontPageUrl,
                    })}"
                    >${i18n("to_front_page")}</lenke-med-sporing
                >
            </div>
            <div class="${cls.links}">
                ${links.map(
                    ({ heading, children }) => html`
                        <div class="${cls.linkGroup}">
                            <h3 class="${cls.linkGroupHeading}">${heading}</h3>
                            <ul class="${cls.linkList}">
                                ${children.map(
                                    ({ content, url }) =>
                                        html`<li>
                                            <lenke-med-sporing
                                                href="${url}"
                                                class="${globalCls[
                                                    "navds-link"
                                                ]}"
                                                data-analytics-event-args="${JSON.stringify(
                                                    {
                                                        category:
                                                            "dekorator-meny",
                                                        action: `${heading}/${content}`,
                                                        label: url,
                                                    },
                                                )}"
                                                >${content}</lenke-med-sporing
                                            >
                                        </li>`,
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
                ({ content, url, description }) =>
                    html`<lenke-med-sporing
                        href="${url}"
                        class="${cls.contextLink}"
                        data-analytics-event-args="${JSON.stringify({
                            category: "dekorator-meny",
                            action: "arbeidsflate-valg",
                            label: content,
                        })}"
                    >
                        <div class="${cls.contextLinkTitle}">${content}</div>
                        ${description &&
                        html`<div class="${cls.contextLinkDescription}">
                            ${description}
                        </div>`}
                    </lenke-med-sporing>`,
            )}
        </div>`}
    </div>`;
}
