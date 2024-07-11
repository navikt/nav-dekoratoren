import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/simple-footer.module.css";
import utilCls from "decorator-client/src/styles/utilities.module.css";
import html from "decorator-shared/html";
import { Features, Link } from "decorator-shared/types";
import i18n from "../../i18n";
import { ScreenshareButton } from "./screenshare-button";

export const SimpleFooter = ({
    links,
    features,
}: {
    links: Link[];
    features: Features;
}) => html`
    <footer class="${cls.simpleFooter}">
        <div class="${cls.simpleFooterContent} ${utilCls.contentContainer}">
            <div class="${cls.footerLinkList}">
                ${links.map(
                    ({ url, content }) => html`
                        <a
                            href="${url}"
                            class="${globalCls["navds-link"]} ${cls.footerLink}"
                            >${content}</a
                        >
                    `,
                )}
            </div>
            ${features["dekoratoren.skjermdeling"] &&
            ScreenshareButton(i18n("share_screen"))}
        </div>
    </footer>
`;
