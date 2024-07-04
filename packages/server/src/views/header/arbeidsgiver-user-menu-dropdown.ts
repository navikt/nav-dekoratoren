import cls from "decorator-client/src/styles/arbeidsgiver-user-menu-dropdown.module.css";
import { BriefcaseIcon } from "decorator-shared/views/icons";
import i18n from "../../i18n";
import { Button } from "../button";
import { DropdownMenu } from "../dropdown-menu";
import { ArbeidsgiverUserMenu } from "./arbeidsgiver-user-menu";
import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";

export type ArbeidsgiverUserMenuProps = {
    href: string;
    logoutUrl: string;
    name: string;
};

//@TODO add test case
export const ArbeidsgiverUserMenuDropdown = ({
    href,
    logoutUrl,
    name,
}: ArbeidsgiverUserMenuProps) => {
    return DropdownMenu({
        button: Button({
            content: i18n("rolle_arbeidsgiver"),
            icon: BriefcaseIcon(),
            variant: "tertiary",
            className: menuItemsCls.menuItem,
        }),
        dropdownClass: cls.arbeidsgiverMenuDropdown,
        dropdownContent: ArbeidsgiverUserMenu({
            href,
            logoutUrl,
            name,
        }),
        attributes: {
            ["data-hj-suppress"]: true,
        },
    });
};
