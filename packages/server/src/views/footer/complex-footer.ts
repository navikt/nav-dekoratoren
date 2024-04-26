import cls from "decorator-client/src/styles/complex-footer.module.css";
import utilCls from "decorator-client/src/styles/utilities.module.css";
import html from "decorator-shared/html";
import { Features, LinkGroup, Texts } from "decorator-shared/types";
import { ArrowUp } from "decorator-shared/views/icons";
import { LenkeMedSporing } from "decorator-shared/views/lenke-med-sporing-helpers";
import { NavLogo } from "decorator-shared/views/nav-logo";
import { ScreenshareButton } from "./screenshare-button";

export type ComplexFooterProps = {
    texts: Pick<Texts, "share_screen" | "to_top">;
    links: LinkGroup[];
    features: Features;
};

export function ComplexFooter({ texts, links, features }: ComplexFooterProps) {
    const isScreensharingEnabled = features["dekoratoren.skjermdeling"];

    // "TODO: Need ID here to be applied accross domains. Can be fixed with modules
    return html`
        <footer class="${cls.footer}" data-theme="dark">
            <div class="${cls.footerContent} ${utilCls.contentContainer}">
                <a class="${cls.link} ${cls.toTop}" href="#">
                    ${ArrowUp({ className: cls.arrowUp })} ${texts.to_top}
                </a>

                <ul class="${cls.footerLinks}">
                    ${links.map(
                        ({ heading, children }) => html`
                            <li class="${cls.footerLinkGroup}">
                                ${heading &&
                                html`<h2 class="${cls.footerLinkHeading}">
                                    ${heading}
                                </h2>`}
                                <ul class="${cls.footerInnerLinkList}">
                                    ${children.map(
                                        ({ url, content }) => html`
                                            <li>
                                                ${LenkeMedSporing({
                                                    href: url,
                                                    children: content,
                                                    className: `${cls.link} ${cls.footerLink}`,
                                                    analyticsEventArgs: {
                                                        category:
                                                            "dekorator-footer",
                                                        action: `kontakt/${url}`,
                                                        label: url,
                                                    },
                                                })}
                                            </li>
                                        `,
                                    )}
                                </ul>
                            </li>
                        `,
                    )}
                    ${isScreensharingEnabled &&
                    html`<li>${ScreenshareButton(texts.share_screen)}</li>`}
                </ul>

                <div class="${cls.complexFooterOrg}">
                    ${NavLogo({
                        id: "dekoratoren-footer-logo",
                    })}

                    <span>Arbeids- og velferdsetaten</span>
                </div>
            </div>
        </footer>
    `;
}
