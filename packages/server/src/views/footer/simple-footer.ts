import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/simple-footer.module.css";
import utilCls from "decorator-client/src/styles/utilities.module.css";
import html from "decorator-shared/html";
import { Features, Link, Texts } from "decorator-shared/types";
import { LenkeMedSporing } from "decorator-shared/views/lenke-med-sporing-helpers";
import { ScreenshareButton } from "./screenshare-button";

export type SimpleFooterProps = {
    links: Link[];
    texts: Texts;
    features: Features;
};

export const SimpleFooter = ({
    links,
    texts,
    features,
}: SimpleFooterProps) => html`
    <footer class="${cls.simpleFooter}">
        <div class="${cls.simpleFooterContent} ${utilCls.contentContainer}">
            <div class="${cls.footerLinkList}">
                ${links.map(({ url, content }) =>
                    LenkeMedSporing({
                        href: url,
                        children: content,
                        className: globalCls.link,
                        analyticsEventArgs: {
                            category: "dekorator-footer",
                            action: `kontakt/${url}`,
                            label: url,
                        },
                    }),
                )}
            </div>
            ${features["dekoratoren.skjermdeling"] &&
            ScreenshareButton(texts.share_screen)}
        </div>
    </footer>
`;
