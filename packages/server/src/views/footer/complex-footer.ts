import aksel from "decorator-client/src/styles/aksel.module.css";
import cls from "decorator-client/src/styles/complex-footer.module.css";
import utilCls from "decorator-client/src/styles/utils.module.css";
import { ArrowUpIcon } from "decorator-icons";
import html from "decorator-shared/html";
import { Features, LinkGroup } from "decorator-shared/types";
import { NavLogo } from "decorator-shared/views/nav-logo";
import i18n from "../../i18n";
import { ScreenshareButton } from "./screenshare-button";

export const ComplexFooter = ({
    links,
    features,
}: {
    links: LinkGroup[];
    features: Features;
}) => html`
    <footer class="${cls.footer}" data-theme="dark">
        <div class="${cls.footerContent} ${utilCls.contentContainer}">
            <a class="${aksel["navds-link"]} ${cls.toTop}" href="#"
                >${ArrowUpIcon({ className: cls.arrowUp })}${i18n("to_top")}</a
            >
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
                                            <a
                                                href="${url}"
                                                class="${aksel[
                                                    "navds-link"
                                                ]} ${cls.footerLink}"
                                                >${content}</a
                                            >
                                        </li>
                                    `,
                                )}
                            </ul>
                        </li>
                    `,
                )}
                ${features["dekoratoren.skjermdeling"] &&
                html`<li>${ScreenshareButton(i18n("share_screen"))}</li>`}
            </ul>
            <div class="${cls.complexFooterOrg}">
                ${NavLogo()}<span>Arbeids- og velferdsetaten</span>
            </div>
        </div>
    </footer>
`;
