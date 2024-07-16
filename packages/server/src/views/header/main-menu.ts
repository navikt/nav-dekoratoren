import clsx from "clsx";
import aksel from "decorator-client/src/styles/aksel.module.css";
import cls from "decorator-client/src/styles/main-menu.module.css";
import html, { Template } from "decorator-shared/html";
import { Params } from "decorator-shared/params";
import { LinkGroup, MainMenuContextLink } from "decorator-shared/types";
import { makeFrontpageUrl } from "decorator-shared/urls";
import { env } from "../../env/server";
import i18n from "../../i18n";
import { getMainMenuLinks, mainMenuContextLinks } from "../../menu/main-menu";

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
                    <h2
                        class="${clsx(
                            aksel["navds-heading"],
                            aksel["navds-heading--medium"],
                        )}"
                    >
                        ${title}
                    </h2>
                    <a href="${frontPageUrl}" class="${aksel["navds-link"]}"
                        >${i18n("to_front_page")}</a
                    >
                </div>
                <div class="${cls.links}">
                    ${links.map(
                        ({ heading, children }) => html`
                            <div class="${cls.linkGroup}">
                                <h3
                                    class="${clsx(
                                        aksel["navds-heading"],
                                        aksel["navds-heading--small"],
                                        cls.linkGroupHeading,
                                    )}"
                                >
                                    ${heading}
                                </h3>
                                <ul class="${cls.linkList}">
                                    ${children.map(
                                        ({ content, url }) => html`
                                            <li>
                                                <a
                                                    href="${url}"
                                                    class="${aksel[
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

export async function MainMenuTemplate({ data }: { data: Params }) {
    return MainMenu({
        title:
            data.context === "privatperson"
                ? i18n("how_can_we_help")
                : i18n(data.context),
        frontPageUrl: makeFrontpageUrl({
            context: data.context,
            language: data.language,
            baseUrl: env.XP_BASE_URL,
        }),
        links: await getMainMenuLinks({
            language: data.language,
            context: data.context,
        }),
        contextLinks: mainMenuContextLinks({
            context: data.context,
            language: data.language,
            bedrift: data.bedrift,
        }),
    });
}
