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
        ${htmlAttributes(attributes)}
        ${href ? html`href="${href}"` : html`type="${type}"`}
        class="${clsx(
            cls["navds-button"],
            {
                [cls["navds-button--primary"]]: variant === "primary",
                [cls["navds-button--secondary"]]: variant === "secondary",
                [cls["navds-button--tertiary"]]: variant === "tertiary",
            },
            className,
        )}"
    >
        ${
            icon &&
            html`<span class="${cls["navds-button__icon"]}">${icon}</span>`
        }
        <span class="${clsx(cls["navds-label"], "label")}">${content}</span>
    </${href ? "a" : "button"}>
`;
