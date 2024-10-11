import cls from "decorator-client/src/styles/header.module.css";
import opsMessagesCls from "decorator-client/src/styles/ops-messages.module.css";
import utilsCls from "decorator-client/src/styles/utils.module.css";
import html, { Template } from "decorator-shared/html";
import { NavLogo } from "decorator-shared/views/nav-logo";
import i18n from "../../i18n";
import { SkipLink } from "../skip-link";
import { UserMenu } from "../user-menu";

export type SimpleHeaderProps = {
    decoratorUtils: Template;
    frontPageUrl: string;
    loginUrl: string;
};

export const SimpleHeader = ({
    decoratorUtils,
    frontPageUrl,
    loginUrl,
}: SimpleHeaderProps) => html`
    <header-content>
        <div class="${cls.siteheader}">
            ${SkipLink(i18n("skip_link"))}
            <div class="${cls.hovedmenyWrapper} ${utilsCls.contentContainer}">
                <a href="${frontPageUrl}" class="${cls.logo} ${cls.logoSimple}"
                    >${NavLogo({
                        title: i18n("to_front_page"),
                        titleId: "logo-svg-title",
                    })}</a
                >
                ${UserMenu({ loginUrl })}
            </div>
        </div>
    </header-content>
    <ops-messages class="${opsMessagesCls.opsMessages}"></ops-messages>
    ${decoratorUtils}
`;
