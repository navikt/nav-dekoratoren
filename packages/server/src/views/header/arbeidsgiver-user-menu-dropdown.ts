import cls from "decorator-client/src/styles/arbeidsgiver-user-menu-dropdown.module.css";
import { BriefcaseIcon } from "decorator-shared/views/icons";
import { DropdownMenu } from "../dropdown-menu";
import { ArbeidsgiverUserMenu } from "./arbeidsgiver-user-menu";
import { IconButton } from "decorator-shared/views/icon-button";

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
        button: IconButton({
            id: "123",
            text: "Arbeidsgiver",
            Icon: BriefcaseIcon({ className: cls.icon }),
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
