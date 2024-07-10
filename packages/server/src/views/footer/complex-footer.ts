import cls from "decorator-client/src/styles/complex-footer.module.css";
import globalCls from "decorator-client/src/styles/global.module.css";
import utilCls from "decorator-client/src/styles/utilities.module.css";
import html from "decorator-shared/html";
import { Features, LinkGroup } from "decorator-shared/types";
import { ArrowUpIcon } from "decorator-icons";
import { LenkeMedSporing } from "decorator-shared/views/lenke-med-sporing-helpers";
import { NavLogo } from "decorator-shared/views/nav-logo";
import i18n from "../../i18n";
import { ScreenshareButton } from "./screenshare-button";

export type ComplexFooterProps = {
    links: LinkGroup[];
    features: Features;
};

export function ComplexFooter({ links, features }: ComplexFooterProps) {
    const isScreensharingEnabled = features["dekoratoren.skjermdeling"];

    // "TODO: Need ID here to be applied accross domains. Can be fixed with modules
    return html`
        <footer class="${cls.footer}" data-theme="dark">
            <div class="${cls.footerContent} ${utilCls.contentContainer}">
                <a class="${globalCls["navds-link"]} ${cls.toTop}" href="#">
                    ${ArrowUpIcon({ className: cls.arrowUp })} ${i18n("to_top")}
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
                                                    className: `${globalCls["navds-link"]} ${cls.footerLink}`,
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
                    html`<li>${ScreenshareButton(i18n("share_screen"))}</li>`}
                </ul>

                <div class="${cls.complexFooterOrg}">
                    ${NavLogo()}

                    <span>Arbeids- og velferdsetaten</span>
                </div>
            </div>
        </footer>
    `;
}
