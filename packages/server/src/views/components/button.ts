import clsx from "clsx";
import cls from "decorator-client/src/styles/aksel.module.css";
import html, {
    AttributeValue,
    Template,
    htmlAttributes,
} from "decorator-shared/html";

export type ButtonProps = {
    content: Template;
    icon?: Template;
    variant?: "primary" | "secondary" | "tertiary";
    type?: "button" | "submit" | "reset";
    className?: string;
    attributes?: Record<string, AttributeValue>;
    href?: string;
};

export const Button = ({
    content,
    icon,
    variant = "tertiary",
    type = "button",
    className,
    attributes = {},
    href,
}: ButtonProps) => html`
    <${href ? "a" : "button"}
        ${htmlAttributes({ ...attributes, ["data-variant"]: variant })}
        ${href ? html`href="${href}"` : html`type="${type}"`}
        class="${clsx(cls["aksel-button"], className)}"
    >
        ${
            icon &&
            html`<span class="${cls["aksel-button__icon"]}">${icon}</span>`
        }
        <span class="${clsx(cls["aksel-label"], "label")}">${content}</span>
    </${href ? "a" : "button"}>
`;
