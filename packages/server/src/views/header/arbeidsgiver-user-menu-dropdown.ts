import cls from "decorator-client/src/styles/arbeidsgiver-user-menu.module.css";
import { BriefcaseIcon } from "decorator-icons";
import i18n from "../../i18n";
import { HeaderButton } from "../components/header-button";
import { DropdownMenu } from "../dropdown-menu";
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
            content: i18n("arbeidsgiver"),
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
            ["menu-type"]: "user",
        },
    });
};
