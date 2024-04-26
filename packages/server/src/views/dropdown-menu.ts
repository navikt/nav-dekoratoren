import clsx from "clsx";
import html, { Template } from "decorator-shared/html";
import cls from "decorator-client/src/styles/dropdown-menu.module.css";

export type DropdownMenuProps = {
    button: Template;
    dropdownContent: Template;
    dropdownClass?: string;
};

export const DropdownMenu = ({
    button,
    dropdownContent,
    dropdownClass,
}: DropdownMenuProps) =>
    html`<dropdown-menu>
        ${button}
        <div class="${clsx(cls.dropdownMenuContainer, dropdownClass)}">
            ${dropdownContent}
        </div>
    </dropdown-menu>`;
