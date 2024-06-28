import clsx from "clsx";
import html, {
    AttributeValue,
    Template,
    htmlAttributes,
} from "decorator-shared/html";
import cls from "decorator-client/src/styles/dropdown-menu.module.css";

export type DropdownMenuProps = {
    button: Template;
    dropdownContent: Template;
    dropdownClass?: string;
    attributes?: Record<string, AttributeValue>;
};

export const DropdownMenu = ({
    button,
    dropdownContent,
    dropdownClass,
    attributes = {},
}: DropdownMenuProps) =>
    html`<dropdown-menu ${htmlAttributes(attributes)}>
        ${button}
        <div class="${clsx(cls.dropdownMenuContainer, dropdownClass)}">
            ${dropdownContent}
        </div>
    </dropdown-menu>`;
