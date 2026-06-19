import clsx from "clsx";
import cls from "decorator-client/src/styles/dropdown-menu.module.css";
import html, {
    htmlAttributes,
    type AttributeValue,
    type Template,
} from "../html";
import { defineHydrationHooks, hydrateAttrObject } from "../hydration";

export const [dropdownMenuHook, dropdownMenuSelector] = defineHydrationHooks({
    trigger: "dropdown.trigger",
});

export type DropdownMenuProps = {
    button: (attributes: Record<string, AttributeValue>) => Template;
    dropdownContent: Template;
    dropdownClass?: string;
    attributes?: Record<string, AttributeValue>;
};

export const DropdownMenu = ({
    button,
    dropdownContent,
    dropdownClass,
    attributes = {},
}: DropdownMenuProps) => html`
    <dropdown-menu ${htmlAttributes(attributes)} aria-expanded="false">
        ${button(hydrateAttrObject(dropdownMenuHook.trigger))}
        <div class="${clsx(cls.dropdownMenuContainer, dropdownClass)}">
            ${dropdownContent}
        </div>
    </dropdown-menu>
`;
