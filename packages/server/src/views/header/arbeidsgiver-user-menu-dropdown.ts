import cls from "decorator-client/src/styles/arbeidsgiver-user-menu-dropdown.module.css";
import html from "decorator-shared/html";
import { Texts } from "decorator-shared/types";
import { BriefcaseIcon } from "decorator-shared/views/icons";
import { DropdownMenu } from "../dropdown-menu";
import { IconButton } from "../icon-button";
import { ArbeidsgiverUserMenu } from "./arbeidsgiver-user-menu";

export type ArbeidsgiverUserMenuProps = {
    texts: Texts;
    href: string;
    logoutUrl: string;
    name: string;
};

//@TODO add test case
export const ArbeidsgiverUserMenuDropdown = ({
    texts,
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
            texts,
            href,
            logoutUrl,
            name,
        }),
        attributes: {
            ["data-hj-suppress"]: true,
        },
    });
};
