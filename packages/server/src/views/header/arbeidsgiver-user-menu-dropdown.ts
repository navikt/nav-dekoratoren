import cls from "decorator-client/src/styles/arbeidsgiver-user-menu-dropdown.module.css";
import { BriefcaseIcon } from "decorator-shared/views/icons";
import i18n from "../../i18n";
import { DropdownMenu } from "../dropdown-menu";
import { HeaderButton } from "../components/header-button";
import { ArbeidsgiverUserMenu } from "./arbeidsgiver-user-menu";

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
        button: HeaderButton({
            content: i18n("rolle_arbeidsgiver"),
            icon: BriefcaseIcon(),
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
